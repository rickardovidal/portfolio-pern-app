// src/components/ui/TestVideo.jsx
// COMPONENTE TEMPORÁRIO PARA DEBUG
import React, { useState } from 'react';

const TestVideo = () => {
    const [testResults, setTestResults] = useState({});
    
    // Testar caminhos diferentes
    const videoPaths = [
        '/portfolio/motion/foguetao.mp4',
        './portfolio/motion/foguetao.mp4',
        'portfolio/motion/foguetao.mp4',
        process.env.PUBLIC_URL + '/portfolio/motion/foguetao.mp4'
    ];
    
    const testVideoPath = async (path) => {
        try {
            const response = await fetch(path, { method: 'HEAD' });
            return {
                path,
                status: response.status,
                ok: response.ok,
                type: response.headers.get('content-type')
            };
        } catch (error) {
            return {
                path,
                error: error.message
            };
        }
    };
    
    const runTests = async () => {
        console.log('=== INICIANDO TESTES DE VÍDEO ===');
        
        // Testar caminhos
        const results = {};
        for (const path of videoPaths) {
            const result = await testVideoPath(path);
            results[path] = result;
            console.log(`Teste ${path}:`, result);
        }
        
        setTestResults(results);
        
        // Testar VideoModal data
        const mockProject = {
            id: 2,
            type: 'video',
            title: 'Motion Design - Foguetão',
            category: 'Motion Design',
            video: '/portfolio/motion/foguetao.mp4',
            poster: '/portfolio/motion/foguetao-poster.jpeg',
            description: 'Teste de vídeo',
            technologies: ['After Effects']
        };
        
        console.log('Mock Project Data:', mockProject);
    };
    
    return (
        <div style={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20, 
            background: 'white', 
            padding: 20, 
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 9999,
            maxWidth: 400
        }}>
            <h3>Debug Vídeo</h3>
            <button onClick={runTests} style={{
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 5,
                cursor: 'pointer',
                marginBottom: 10
            }}>
                Executar Testes
            </button>
            
            {Object.keys(testResults).length > 0 && (
                <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    {Object.entries(testResults).map(([path, result]) => (
                        <div key={path} style={{ 
                            marginBottom: 10, 
                            padding: 10, 
                            background: result.ok ? '#d4edda' : '#f8d7da',
                            borderRadius: 5
                        }}>
                            <strong>{path}</strong><br/>
                            Status: {result.status || 'N/A'}<br/>
                            {result.error && `Erro: ${result.error}`}
                            {result.type && `Tipo: ${result.type}`}
                        </div>
                    ))}
                </div>
            )}
            
            <hr style={{ margin: '15px 0' }} />
            
            <h4>Teste direto de vídeo:</h4>
            <video 
                controls 
                width="100%" 
                style={{ marginTop: 10 }}
                onError={(e) => console.error('Erro no vídeo de teste:', e)}
                onLoadedData={() => console.log('Vídeo de teste carregado!')}
            >
                <source src="/portfolio/motion/foguetao.mp4" type="video/mp4" />
            </video>
        </div>
    );
};

export default TestVideo;