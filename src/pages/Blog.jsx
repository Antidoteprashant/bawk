import React from 'react';

const Blog = () => {
    return (
        <div style={{ paddingTop: '100px', minHeight: '60vh' }} className="container">
            <h1 className="section-title">Otaku Blog</h1>
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <article style={{ background: '#222', padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ height: '200px', background: '#333', marginBottom: '1rem', borderRadius: '4px' }}></div>
                    <h3>Top 10 Anime Merch of 2026</h3>
                    <p style={{ color: '#aaa', margin: '0.5rem 0' }}>Discover the hottest trends in the anime world that every fan needs to own this year.</p>
                    <button style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#ff3e6c', cursor: 'pointer', fontWeight: 'bold' }}>Read More &rarr;</button>
                </article>
                <article style={{ background: '#222', padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ height: '200px', background: '#333', marginBottom: '1rem', borderRadius: '4px' }}></div>
                    <h3>Convention Guide: Summer 2026</h3>
                    <p style={{ color: '#aaa', margin: '0.5rem 0' }}>Where we will be turning up this year! Check out our booth schedule.</p>
                    <button style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#ff3e6c', cursor: 'pointer', fontWeight: 'bold' }}>Read More &rarr;</button>
                </article>
                <article style={{ background: '#222', padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ height: '200px', background: '#333', marginBottom: '1rem', borderRadius: '4px' }}></div>
                    <h3>Watch Collection Guide</h3>
                    <p style={{ color: '#aaa', margin: '0.5rem 0' }}>Start your watch collection journey with these budget-friendly tips and tricks.</p>
                    <button style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#ff3e6c', cursor: 'pointer', fontWeight: 'bold' }}>Read More &rarr;</button>
                </article>
            </div>
        </div>
    );
};
export default Blog;
