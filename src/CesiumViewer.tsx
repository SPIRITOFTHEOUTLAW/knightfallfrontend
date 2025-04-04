// frontend/src/CesiumViewer.tsx
/// <reference path="./azure-maps-cesium.d.ts" />

import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { useWallet } from './WalletContext';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from './firebase';

import 'cesium/Widgets/widgets.css';
import BlackstarLoader from './BlackstarLoader';

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MmQ5MWRiOS03YjQ3LTQzODEtYTVkMy1iMWJiNDUzN2JkNzciLCJpZCI6Mjg5MjA5LCJpYXQiOjE3NDM1ODc2NzR9.nBG1j9EvAGI6QG9JCZ-OKFUkRzJcO9n05OUGn84A3aQ';

const CesiumViewer: React.FC = () => {
  const { memberName, tokenId, memberCategory } = useWallet();
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [latitude, setLatitude] = useState<string>(''); // Swapped order: Latitude first
  const [longitude, setLongitude] = useState<string>(''); // Swapped order: Longitude second

  useEffect(() => {
    let rafId: number;
    let timeoutId: number;

    async function initCesium() {
      try {
        if (!containerRef.current) {
          throw new Error("Cesium containerRef is still null after layout + paint.");
        }

        console.log("Initializing Cesium...");
        containerRef.current.style.visibility = 'hidden';

        // Test Cesium Ion token
        console.log('Testing Cesium Ion token...');
        const tokenTest = await fetch(
          `https://api.cesium.com/v1/assets/2/endpoint?access_token=${Cesium.Ion.defaultAccessToken}`
        );
        if (!tokenTest.ok) {
          const error = await tokenTest.json();
          throw new Error(`Cesium Ion token invalid: ${JSON.stringify(error)}`);
        }
        console.log('Token is valid:', await tokenTest.json());

        // Azure Maps subscription key
        const AZURE_KEY = '4M4jUk8VKygI9BJZVLOkrWsVKR9MIzxfp2MG51ZLcfK6qBopkxcjJQQJ99BCACi5YpztK3TiAAAgAZMP1tDt';

        // Initialize the Cesium Viewer using an alternative terrain provider
        const viewer = new Cesium.Viewer(containerRef.current, {
          animation: false,
          timeline: false,
          baseLayerPicker: false,
          geocoder: false,
          terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        });
        viewerRef.current = viewer;

        // Remove the default base layer
        viewer.imageryLayers.removeAll();

        // Add the Azure Maps satellite imagery layer using native UrlTemplateImageryProvider
        const azureImageryProvider = new Cesium.UrlTemplateImageryProvider({
          url: `https://atlas.microsoft.com/map/tile?api-version=2.1&tilesetId=microsoft.imagery&zoom={z}&x={x}&y={y}&tileSize=256&language=en-US&view=Auto&subscription-key=${AZURE_KEY}`,
          tileWidth: 256,
          tileHeight: 256,
          maximumLevel: 19, // Satellite imagery max zoom per Azure Maps docs
          hasAlphaChannel: false,
          enablePickFeatures: false,
        });
        viewer.imageryLayers.addImageryProvider(azureImageryProvider);

        // Add an overlay for roads, boundaries, and labels
        const azureHybridProvider = new Cesium.UrlTemplateImageryProvider({
          url: `https://atlas.microsoft.com/map/tile?api-version=2.1&tilesetId=microsoft.base.hybrid.road&zoom={z}&x={x}&y={y}&tileSize=256&language=en-US&view=Auto&subscription-key=${AZURE_KEY}`,
          tileWidth: 256,
          tileHeight: 256,
          maximumLevel: 22, // Hybrid road max zoom
          hasAlphaChannel: true,
          enablePickFeatures: false,
        });
        viewer.imageryLayers.addImageryProvider(azureHybridProvider);

        // Load existing locations from Firestore
        const locationsSnapshot = await getDocs(collection(db, 'locations'));
        locationsSnapshot.forEach((doc) => {
          const { memberName, longitude, latitude } = doc.data();
          addPinToGlobe(memberName, longitude, latitude);
        });

        // Small delay for smoother loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        containerRef.current.style.visibility = 'visible';
        setViewerReady(true);
        console.log("Viewer is now ready.");
      } catch (error) {
        console.error("Error during Cesium initialization:", error);
        setLoadFailed(true);
      }
    }

    // Defer initialization to the next animation frame
    rafId = requestAnimationFrame(() => {
      timeoutId = window.setTimeout(() => {
        if (!containerRef.current) {
          console.error("❌ containerRef is still null after layout + paint.");
          setLoadFailed(true);
          return;
        }
        initCesium();
      }, 0);
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  const addPinToGlobe = (name: string, lon: number, lat: number) => {
    if (viewerRef.current) {
      // Remove all existing pins for this user (based on tokenId)
      if (tokenId) {
        viewerRef.current.entities.removeAll(); // Clear all pins (we'll re-add others below)
        // Re-add pins for other users
        getDocs(collection(db, 'locations')).then((snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (doc.id !== tokenId) { // Skip the current user's pin
              addPinToGlobe(data.memberName, data.longitude, data.latitude);
            }
          });
        });
      }

      // Add the new pin for this user
      viewerRef.current.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat), // Cesium expects longitude, latitude
        point: {
          pixelSize: 10,
          color: Cesium.Color.BLUE,
        },
        label: {
          text: name,
          font: '14pt MedievalSharp, Arial, sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        },
      });
    }
  };

  const saveLocation = async (tokenId: string, lon: number, lat: number) => {
    await setDoc(doc(db, 'locations', tokenId), {
      tokenId,
      longitude: lon,
      latitude: lat,
      memberName,
      memberCategory,
      createdAt: new Date().toISOString(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (memberName && tokenId && memberCategory && latitude && longitude) {
      const lat = parseFloat(latitude); // Latitude first
      const lon = parseFloat(longitude); // Longitude second
      if (lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90) {
        addPinToGlobe(memberName, lon, lat); // Pass in longitude, latitude order for Cesium
        await saveLocation(tokenId, lon, lat);
        setLatitude('');
        setLongitude('');
      } else {
        alert('Invalid coordinates! Latitude must be between -90 and 90, longitude between -180 and 180.');
      }
    } else {
      alert('Cannot pin location: Missing member data, token ID, or rank.');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {!viewerReady && !loadFailed && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <BlackstarLoader />
        </div>
      )}
      {loadFailed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            color: 'white',
            textAlign: 'center',
            paddingTop: '20vh',
            backgroundColor: 'black',
            zIndex: 3,
          }}
        >
          <p>❌ Failed to initialize Cesium Viewer.</p>
          <p>Check DevTools Console for errors.</p>
        </div>
      )}
      {viewerReady && memberName && tokenId && memberCategory ? (
        <form
          onSubmit={handleSubmit}
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 2,
            background: '#000000',
            padding: '15px',
            border: '2px solid #00FF00',
            fontFamily: '"Courier New", Courier, monospace',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <h3 style={{ margin: 0, color: '#FFFFFF' }}>Welcome, {memberName}</h3>
          <p style={{ margin: 0, color: '#FFFFFF' }}>Token ID: {tokenId}</p>
          <p style={{ margin: 0, color: '#FFFFFF' }}>Rank: {memberCategory}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#00FF00' }}>Latitude</label> {/* Swapped: Latitude first */}
            <input
              type="number"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              step="any"
              required
              style={{
                background: '#000000',
                color: '#00FF00',
                border: '1px solid #00FF00',
                padding: '5px',
                fontFamily: '"Courier New", Courier, monospace',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#00FF00' }}>Longitude</label> {/* Swapped: Longitude second */}
            <input
              type="number"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              step="any"
              required
              style={{
                background: '#000000',
                color: '#00FF00',
                border: '1px solid #00FF00',
                padding: '5px',
                fontFamily: '"Courier New", Courier, monospace',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: '#000000',
              color: '#00FF00',
              border: '1px solid #00FF00',
              padding: '5px 10px',
              fontFamily: '"Courier New", Courier, monospace',
              cursor: 'pointer',
              marginTop: '5px',
            }}
          >
            Pin Location
          </button>
        </form>
      ) : viewerReady && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 2,
            background: '#000000',
            padding: '15px',
            border: '2px solid #00FF00',
            fontFamily: '"Courier New", Courier, monospace',
            color: '#FFFFFF',
          }}
        >
          <p style={{ margin: 0 }}>Member data, token ID, or rank not available. Please ensure you have minted an NFT.</p>
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: 0,
          visibility: viewerReady ? 'visible' : 'hidden',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default CesiumViewer;