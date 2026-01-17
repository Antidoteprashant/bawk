import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../src/index.css' // Shared styles
import AdminApp from './AdminApp.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AdminApp />
    </StrictMode>,
)
