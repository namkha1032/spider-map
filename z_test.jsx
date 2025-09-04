import React, { useState, useRef, useCallback, useEffect } from 'react';

const ZoomPanWrapper = ({ children }) => {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleWheel = useCallback((e) => {
        if (e.ctrlKey) {
            e.preventDefault();

            const rect = containerRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate the point in the content space before zoom
            const beforeZoomX = (mouseX - pan.x) / zoom;
            const beforeZoomY = (mouseY - pan.y) / zoom;

            // Update zoom
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = Math.min(Math.max(zoom * delta, 0.1), 10);

            // Calculate new pan to keep the mouse point fixed
            const newPanX = mouseX - beforeZoomX * newZoom;
            const newPanY = mouseY - beforeZoomY * newZoom;

            setZoom(newZoom);
            setPan({ x: newPanX, y: newPanY });
        }
    }, [zoom, pan]);

    const handleMouseDown = useCallback((e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({
                x: e.clientX - pan.x,
                y: e.clientY - pan.y
            });
        }
    }, [pan]);

    const handleMouseMove = useCallback((e) => {
        if (isDragging && e.ctrlKey) {
            e.preventDefault();
            setPan({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback((e) => {
        setIsDragging(false);
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.ctrlKey && e.key === '0') {
            e.preventDefault();
            setZoom(1);
            setPan({ x: 0, y: 0 });
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => {
                container.removeEventListener('wheel', handleWheel);
            };
        }
    }, [handleWheel]);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleMouseMove, handleMouseUp, handleKeyDown]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden bg-gray-100 cursor-grab"
            style={{
                cursor: isDragging ? 'grabbing' : (zoom > 1 ? 'grab' : 'default')
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Instructions overlay */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg text-sm z-50">
                <div className="font-semibold mb-1">Controls:</div>
                <div>Ctrl + Scroll: Zoom in/out</div>
                <div>Ctrl + Drag: Pan around</div>
                <div>Ctrl + 0: Reset zoom</div>
                <div className="mt-2 text-xs text-gray-600">
                    Zoom: {Math.round(zoom * 100)}%
                </div>
            </div>

            {/* Content container */}
            <div
                className="origin-top-left"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: '0 0',
                    width: '100%',
                    height: '100%'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default ZoomPanWrapper;