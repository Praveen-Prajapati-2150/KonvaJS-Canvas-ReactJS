import React, { useRef, useEffect } from 'react';
import Konva from 'konva';

const KonvaComponent = ({
  shapes,
  images,
  video,
  onSelect,
  selectedId,
  onTransform,
}) => {
  const containerRef = useRef(null);
  const transformerRef = useRef(null);
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const shapesRef = useRef(new Map());

  useEffect(() => {

    const stage = new Konva.Stage({
      container: containerRef.current,
      width: 550,
      height: 550,
    });
    
    stageRef.current = stage;

    const videoLayer = new Konva.Layer();
    const contentLayer = new Konva.Layer();
    const transformerLayer = new Konva.Layer();

    stage.add(videoLayer);
    stage.add(contentLayer);
    stage.add(transformerLayer);

    const boundary = {
      x: 0,
      y: 0,
      width: 550,
      height: 550,
    };

    const boundaryRect = new Konva.Rect({
      x: boundary.x,
      y: boundary.y,
      width: boundary.width,
      height: boundary.height,
      stroke: 'blue',
      strokeWidth: 2,
    });

    contentLayer.add(boundaryRect);

    const transformer = new Konva.Transformer({
      rotateEnabled: true,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    });
    transformerRef.current = transformer;
    transformerLayer.add(transformer);

    const updateTransformerNodes = () => {
      const selectedNode = shapesRef.current.get(selectedId);
      if (selectedNode) {
        transformer.nodes([selectedNode]);
        transformerLayer.batchDraw();
      } else {
        transformer.nodes([]);
        transformerLayer.batchDraw();
      }
    };

    const drawShapes = () => {
      // Clear existing shapes
      shapesRef.current.clear();
      contentLayer.destroyChildren();
      contentLayer.add(boundaryRect);

      shapes.forEach((shape) => {
        let shapeElement;
        if (shape.type === 'rectangle') {
          shapeElement = new Konva.Rect({
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
            fill: shape.fill,
            draggable: true,
            id: shape.id.toString(),
            scaleX: shape.scaleX,
            scaleY: shape.scaleY,
            rotation: shape.rotation,
          });
        } else if (shape.text) {
          shapeElement = new Konva.Text({
            x: shape.x,
            y: shape.y,
            text: shape.text,
            fontSize: shape.fontSize,
            fill: shape.fill,
            draggable: true,
            id: shape.id.toString(),
            scaleX: shape.scaleX,
            scaleY: shape.scaleY,
            rotation: shape.rotation,
          });
        }

        shapeElement.on('click', (e) => {
          e.cancelBubble = true;
          onSelect(parseInt(shapeElement.id()));
        });

        shapeElement.on('transformend dragend', () => {
          const node = shapeElement;
          onTransform(parseInt(node.id()), {
            x: node.x(),
            y: node.y(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: node.rotation(),
          });
        });

        contentLayer.add(shapeElement);
        shapesRef.current.set(shape.id, shapeElement);
      });

      contentLayer.draw();
    };

    const drawImages = () => {
      images.forEach((image) => {
        const imgElement = new window.Image();
        imgElement.src = image.src;
        imgElement.onload = () => {
          const konvaImage = new Konva.Image({
            x: image.x,
            y: image.y,
            image: imgElement,
            width: image.width,
            height: image.height,
            draggable: true,
            id: image.id.toString(),
            scaleX: image.scaleX,
            scaleY: image.scaleY,
            rotation: image.rotation,
          });

          konvaImage.on('click', (e) => {
            e.cancelBubble = true;
            onSelect(parseInt(konvaImage.id()));
          });

          konvaImage.on('transformend dragend', () => {
            const node = konvaImage;
            onTransform(parseInt(node.id()), {
              x: node.x(),
              y: node.y(),
              scaleX: node.scaleX(),
              scaleY: node.scaleY(),
              rotation: node.rotation(),
            });
          });

          contentLayer.add(konvaImage);
          shapesRef.current.set(image.id, konvaImage);
          contentLayer.draw();
          updateTransformerNodes();
        };
      });
    };

    const drawVideo = () => {
      if (video) {
        const videoElement = document.createElement('video');
        videoElement.src = video.src;
        videoElement.width = video.width;
        videoElement.height = video.height;
        videoElement.muted = true;
        videoElement.loop = true;
        videoElement.play();
        videoElement.style.display = 'none';
        document.body.appendChild(videoElement);
        videoRef.current = videoElement;

        const konvaVideo = new Konva.Image({
          x: 0,
          y: 0,
          draggable: false,
        });

        const updateVideoFrame = () => {
          if (videoRef.current) {
            konvaVideo.image(videoRef.current);
            konvaVideo.width(stage.width());
            konvaVideo.height(stage.height());
            videoLayer.batchDraw();
            requestAnimationFrame(updateVideoFrame);
          }
        };

        konvaVideo.on('click', () => {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        });

        videoLayer.add(konvaVideo);
        videoLayer.moveToBottom();
        updateVideoFrame();
      }
    };

    stage.on('click', (e) => {
      if (e.target === stage) {
        onSelect(null);
      }
    });

    drawVideo();
    drawShapes();
    drawImages();
    updateTransformerNodes();

    return () => {
      stage.destroy();
      if (videoRef.current) {
        document.body.removeChild(videoRef.current);
      }
    };
  }, [shapes, images, video, selectedId, onSelect, onTransform]);

  return (
    <div
      ref={containerRef}
      style={{ border: '1px solid black', width: 550, height: 550 }}
    />
  );
};

export default KonvaComponent;
