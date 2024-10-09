import './App.css';
import React, { useState } from 'react';
import KonvaComponent from './components/KonvaComponent';

function App() {
  const [shapes, setShapes] = useState([]);
  const [images, setImages] = useState([]);
  const [text, setText] = useState('');
  const [video, setVideo] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const moveStep = 10;

  const addShape = () => {
    const newShape = {
      id: Date.now(),
      type: 'rectangle',
      x: Math.random() * 400 + 50,
      y: Math.random() * 400 + 50,
      width: 100,
      height: 100,
      fill: 'red',
      scaleX: 1,
      scaleY: 1,
      rotation: 0
    };
    setShapes([...shapes, newShape]);
  };

  const addImage = () => {
    const newImage = {
      id: Date.now(),
      src: 'https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      x: Math.random() * 400 + 50,
      y: Math.random() * 400 + 50,
      width: 100,
      height: 100,
      scaleX: 1,
      scaleY: 1,
      rotation: 0
    };
    setImages([...images, newImage]);
  };

  const addText = () => {
    if (text.trim()) {
      const newText = {
        id: Date.now(),
        text: text,
        x: Math.random() * 400 + 50,
        y: Math.random() * 400 + 50,
        fontSize: 24,
        fill: 'black',
        scaleX: 1,
        scaleY: 1,
        rotation: 0
      };
      setShapes([...shapes, newText]);
      setText('');
    }
  };

  const addVideo = () => {
    const newVideo = {
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      x: 150,
      y: 150,
      width: 300,
      height: 200
    };
    setVideo(newVideo);
  };

  const moveSelected = (direction) => {
    if (!selectedId) return;

    const updatedShapes = shapes.map(shape => {
      if (shape.id === selectedId) {
        return {
          ...shape,
          x: direction === 'left' ? shape.x - moveStep :
             direction === 'right' ? shape.x + moveStep : shape.x,
          y: direction === 'up' ? shape.y - moveStep :
             direction === 'down' ? shape.y + moveStep : shape.y
        };
      }
      return shape;
    });

    const updatedImages = images.map(image => {
      if (image.id === selectedId) {
        return {
          ...image,
          x: direction === 'left' ? image.x - moveStep :
             direction === 'right' ? image.x + moveStep : image.x,
          y: direction === 'up' ? image.y - moveStep :
             direction === 'down' ? image.y + moveStep : image.y
        };
      }
      return image;
    });

    setShapes(updatedShapes);
    setImages(updatedImages);
  };

  const handleTransform = (id, newProps) => {
    setShapes(shapes.map(shape => 
      shape.id === id ? { ...shape, ...newProps } : shape
    ));
    setImages(images.map(image => 
      image.id === id ? { ...image, ...newProps } : image
    ));
  };

  return (
    <div className="main">
      <div className="controller">
        <div className="field">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
          />
          <button onClick={addText}>Add Text</button>
        </div>
        <button onClick={addShape}>Add Shape</button>
        <button onClick={addImage}>Add Image</button>
        <button onClick={addVideo}>Add Video</button>
        
        <div className="movement-controls">
          <button onClick={() => moveSelected('up')}>⬆️ Move Up</button>
          <button onClick={() => moveSelected('down')}>⬇️ Move Down</button>
          <button onClick={() => moveSelected('left')}>⬅️ Move Left</button>
          <button onClick={() => moveSelected('right')}>➡️ Move Right</button>
        </div>
      </div>
      <div className="display">
        <KonvaComponent 
          shapes={shapes} 
          images={images} 
          video={video}
          onSelect={setSelectedId}
          selectedId={selectedId}
          onTransform={handleTransform}
        />
      </div>
    </div>
  );
}

export default App;