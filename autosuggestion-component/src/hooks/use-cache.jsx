import { useState, useCallback } from 'react';

const useCache = (maxSize = 50, expirationTime = 5 * 60 * 1000) => {
    const [cache, setCache] = useState({});

    const addToCache = useCallback((key, value) => {
        setCache(prevCache => {
            const newCache = { ...prevCache };
            
            // Add timestamp for expiration
            newCache[key] = {
                data: value,
                timestamp: Date.now()
            };

            // Implement LRU (Least Recently Used) cache eviction
            const cacheKeys = Object.keys(newCache);
            if (cacheKeys.length > maxSize) {
                // Find oldest entry
                let oldestKey = cacheKeys[0];
                let oldestTime = newCache[oldestKey].timestamp;
                
                cacheKeys.forEach(k => {
                    if (newCache[k].timestamp < oldestTime) {
                        oldestTime = newCache[k].timestamp;
                        oldestKey = k;
                    }
                });
                
                delete newCache[oldestKey];
            }

            return newCache;
        });
    }, [maxSize]);

    const getCachedValue = useCallback((key) => {
        const cached = cache[key];
        
        if (!cached) return null;

        // Check if cache has expired
        const isExpired = Date.now() - cached.timestamp > expirationTime;
        
        if (isExpired) {
            setCache(prevCache => {
                const newCache = { ...prevCache };
                delete newCache[key];
                return newCache;
            });
            return null;
        }

        return cached.data;
    }, [cache, expirationTime]);

    const clearCache = useCallback(() => {
        setCache({});
    }, []);

    const removeCacheEntry = useCallback((key) => {
        setCache(prevCache => {
            const newCache = { ...prevCache };
            delete newCache[key];
            return newCache;
        });
    }, []);

    return { 
        cache,
        addToCache, 
        getCachedValue,
        clearCache,
        removeCacheEntry
    };
};

export default useCache;