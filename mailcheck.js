(() => {

    if(window.Mailcheck !== undefined){
        console.warn("Mailcheck is already defined!");
        return;
    }

    /**
     * Object.freeze() wrapper function for code minification optimization
     * 
     * This wrapper serves primarily to reduce the size of the minified code. By defining this
     * short alias, the minifier can optimize repeated calls to Object.freeze() throughout the
     * codebase, resulting in smaller bundle size. It provides no additional functionality
     * beyond the native Object.freeze() method.
     * 
     * @author Pedro Rigolin
     * @param {Object} obj - The object to freeze
     * @returns {Object} The frozen object
     * @function
     */
    const objFreeze = Object.freeze( (obj) => { return Object.freeze(obj) } );

    /**
     * Returns all property keys from an object, including non-enumerable properties and symbol keys
     * 
     * This function combines Object.getOwnPropertyNames() and Object.getOwnPropertySymbols() 
     * to provide a complete list of all property keys in an object, regardless of their 
     * enumerability or type (string or symbol).
     * 
     * Performance optimizations implemented:
     * - Early return optimization: Returns immediately if only one key type exists
     * - Pre-allocated array: Creates the result array with exact size to avoid resizing
     * - Reverse while loops: More efficient iteration pattern for better performance
     * 
     * @author Pedro Rigolin
     * @param {Object} obj - The object from which to extract all property keys
     * @returns {Array<string|symbol>} Array containing all property names (strings) and symbols
     * 
     * @example
     * const obj = { a: 1, [Symbol('test')]: 2 };
     * Object.defineProperty(obj, 'hidden', { value: 3, enumerable: false });
     * const allKeys = objFullKeys(obj); // ['a', 'hidden', Symbol('test')]
     */
    const objFullKeys = objFreeze( (obj) => { 

        const names = Object.getOwnPropertyNames(obj);

        const symbols = Object.getOwnPropertySymbols(obj);

        const sl = symbols.length;

        if ( sl === 0 ) return names;

        const nl = names.length;

        if ( nl === 0 ) return symbols;

        const keys = new Array(names.length + symbols.length);
        
        let i = names.length;

        while (i--) keys[i] = names[i];
        
        let j = symbols.length;

        while (j--) keys[names.length + j] = symbols[j];
        
        return keys;
    
    });

    /**
     * Recursively freezes objects and functions deeply
     * 
     * This function performs deep freezing of objects and functions, making them completely
     * immutable by freezing all nested properties recursively. It serves dual purposes:
     * reducing minified code size and improving code readability by eliminating the need
     * to manually freeze each property and function throughout the codebase.
     * 
     * The function utilizes objFullKeys() to ensure comprehensive freezing, including
     * symbol properties and non-enumerable properties that would be missed by standard
     * Object.keys() iteration. This guarantees complete immutability of the target object.
     * 
     * Performance optimizations:
     * - Uses objFullKeys for complete property coverage including symbols
     * - Reverse while loop for efficient iteration
     * - Type checking before recursion to avoid unnecessary calls
     * 
     * @author Pedro Rigolin
     * @param {Object|Function} obj - The object or function to freeze deeply
     * @returns {Object|Function} The deeply frozen object or function
     * 
     * @example
     * const nested = { a: { b: { c: 1 } }, fn: () => {} };
     * const frozen = objDeepFreeze(nested);
     * // All levels are now frozen: nested, nested.a, nested.b, nested.fn
     */
    const objDeepFreeze = objFreeze( (obj) => {

        if( typeof obj === 'object' ) {

            const keys = objFullKeys(obj);

            let keysLength = keys.length;

            while(keysLength--){

                const key = keys[keysLength];

                if( typeof obj[key] === 'object' || typeof obj[key] === 'function' ){

                    obj[key] = objDeepFreeze(obj[key]);

                }

            }

        }

        return objFreeze(obj);

    });
    
    /**
     * Regular expression cache for Mailcheck validation aliases
     * 
     * This object centralizes all pre-compiled regex patterns used by Mailcheck.check(),
     * mapped to the aliases exposed by Mailcheck.types. By caching the patterns in a
     * single immutable object, the validation process avoids repeated RegExp creation
     * and keeps the rule set easier to maintain.
     * 
     * Performance and safety notes:
     * - Pre-compiled regex instances avoid unnecessary runtime allocations
     * - Deep freeze prevents accidental mutation of validation rules
     * - Direct alias lookup (regexCache[type]) keeps access predictable
     * 
     * @author Pedro Rigolin
     * @type {{ANY: RegExp, COMMON: RegExp, POPULAR: RegExp}}
     */    
    const regexCache = objDeepFreeze({

        ANY: /^[a-zA-Z0-9._%+\-çÇ]+@[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/,

        COMMON: /^[a-zA-Z0-9._%+\-çÇ]+@[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?)*\.(com\.br|com|br)$/,

        POPULAR: /^[a-zA-Z0-9._%+\-çÇ]+@(gmail\.com|outlook\.com(\.br)?|hotmail\.com(\.br)?|live\.com(\.br)?|yahoo\.com(\.br)?|terra\.com(\.br)?|icloud\.com|uol\.com\.br|myyahoo\.com(\.br)?)$/,

    });

    Object.defineProperty(window, 'Mailcheck', {

        value: objDeepFreeze({

            types: {

                ANY: 'ANY',
                COMMON: 'COMMON',
                POPULAR: 'POPULAR'

            },

            check: (email, type = 'ANY') => {

                if( typeof email !== 'string' ) {
                    console.error("Invalid email provided to Mailcheck.check. Expected a string.");
                    return false;
                }                

                if(typeof type !== 'string') {
                    console.error("Invalid type provided to Mailcheck.check. Expected a string. Recommended: use aliases from Mailcheck.types (e.g., Mailcheck.types.ANY).");
                    return false;
                }

                if( ! Mailcheck.types.hasOwnProperty(type) ) {
                    console.error("Invalid type provided to Mailcheck.check. Type does not exist in Mailcheck.types.");
                    return false;
                }

                const regex = regexCache[type];

                return regex.test(email);

            }

        }),
        writable: false,
        configurable: false,
        enumerable: false

    });

})();