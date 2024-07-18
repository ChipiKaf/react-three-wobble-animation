import './style.css'
import * as THREE from 'three'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <Canvas
    camera={ {
        fov: 35,
        near: 0.1,
        far: 100,
        position: [ 13, -3, -5 ]
    } }
    shadows
    >
        <Experience />
    </Canvas>
)