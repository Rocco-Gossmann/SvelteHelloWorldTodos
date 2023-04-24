/** @typedef DebugModuleProxy
 * @type {object}
 * @property {(p: string, ...args:any[]) => DebugModuleProxy} prefix
 * @property {(...args:any[]) => void} log
 * @property {(...args:any[]) => void} info
 * @property {(...args:any[]) => void} warn
 * @property {(...args:any[]) => void} error
 */

/** @type {Map<string, DebugModuleProxy} */
const existing_proxys = new Map();

/**
 * @param  {string} _prefix
 * @return {DebugModuleProxy}
 */
function createProxy(_prefix) {

    /**
     * prefix() create a new proxy containing the new and old prefix
     *
     * @param {string} prefixadd - what to append to the existing prefix
     * @param {any} [...args] - will be logged out 
     *
     * @return {DebugModuleProxy}
     */
    function prefix(prefixadd, ...args) {
        const newprefix = _prefix + prefixadd;
        let newProxy;
       
        if(existing_proxys.has(newprefix) ) {
            newProxy = existing_proxys.get(newprefix);
        }
        else {
            newProxy = createProxy(newprefix);
            existing_proxys.set(newprefix, newProxy);
        }

        if (args.length) newProxy.log(...args);

        return newProxy;
    }


    const proxy = {
        /**
        * @param {console} handler 
        * @param {string} prop 
        * @param {any} receiver 
        * @returns {any}
        */
        get: (target, prop) => {
            switch (prop) {
                case "prefix": return proxy.prefix;
                case "_prefix": return _prefix;

                case "log":
                case "warn":
                case "info":
                    if (import.meta.env.PROD) return () => { }

                case "error":
                    return (...args) => target[prop].apply(target, [`[${_prefix}]`, ...args])

            }

            return target[prop]
        },

        prefix
    }

    return new Proxy(console, proxy);
}

export const DebugModule = createProxy("");

export default DebugModule;

