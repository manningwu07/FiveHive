/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/dotenv";
exports.ids = ["vendor-chunks/dotenv"];
exports.modules = {

/***/ "(ssr)/./node_modules/dotenv/lib/main.js":
/*!*****************************************!*\
  !*** ./node_modules/dotenv/lib/main.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const fs = __webpack_require__(/*! fs */ \"fs\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst os = __webpack_require__(/*! os */ \"os\")\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\")\nconst packageJson = __webpack_require__(/*! ../package.json */ \"(ssr)/./node_modules/dotenv/package.json\")\n\nconst version = packageJson.version\n\nconst LINE = /(?:^|^)\\s*(?:export\\s+)?([\\w.-]+)(?:\\s*=\\s*?|:\\s+?)(\\s*'(?:\\\\'|[^'])*'|\\s*\"(?:\\\\\"|[^\"])*\"|\\s*`(?:\\\\`|[^`])*`|[^#\\r\\n]+)?\\s*(?:#.*)?(?:$|$)/mg\n\n// Parse src into an Object\nfunction parse (src) {\n  const obj = {}\n\n  // Convert buffer to string\n  let lines = src.toString()\n\n  // Convert line breaks to same format\n  lines = lines.replace(/\\r\\n?/mg, '\\n')\n\n  let match\n  while ((match = LINE.exec(lines)) != null) {\n    const key = match[1]\n\n    // Default undefined or null to empty string\n    let value = (match[2] || '')\n\n    // Remove whitespace\n    value = value.trim()\n\n    // Check if double quoted\n    const maybeQuote = value[0]\n\n    // Remove surrounding quotes\n    value = value.replace(/^(['\"`])([\\s\\S]*)\\1$/mg, '$2')\n\n    // Expand newlines if double quoted\n    if (maybeQuote === '\"') {\n      value = value.replace(/\\\\n/g, '\\n')\n      value = value.replace(/\\\\r/g, '\\r')\n    }\n\n    // Add to object\n    obj[key] = value\n  }\n\n  return obj\n}\n\nfunction _parseVault (options) {\n  const vaultPath = _vaultPath(options)\n\n  // Parse .env.vault\n  const result = DotenvModule.configDotenv({ path: vaultPath })\n  if (!result.parsed) {\n    const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`)\n    err.code = 'MISSING_DATA'\n    throw err\n  }\n\n  // handle scenario for comma separated keys - for use with key rotation\n  // example: DOTENV_KEY=\"dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=prod,dotenv://:key_7890@dotenvx.com/vault/.env.vault?environment=prod\"\n  const keys = _dotenvKey(options).split(',')\n  const length = keys.length\n\n  let decrypted\n  for (let i = 0; i < length; i++) {\n    try {\n      // Get full key\n      const key = keys[i].trim()\n\n      // Get instructions for decrypt\n      const attrs = _instructions(result, key)\n\n      // Decrypt\n      decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key)\n\n      break\n    } catch (error) {\n      // last key\n      if (i + 1 >= length) {\n        throw error\n      }\n      // try next key\n    }\n  }\n\n  // Parse decrypted .env string\n  return DotenvModule.parse(decrypted)\n}\n\nfunction _log (message) {\n  console.log(`[dotenv@${version}][INFO] ${message}`)\n}\n\nfunction _warn (message) {\n  console.log(`[dotenv@${version}][WARN] ${message}`)\n}\n\nfunction _debug (message) {\n  console.log(`[dotenv@${version}][DEBUG] ${message}`)\n}\n\nfunction _dotenvKey (options) {\n  // prioritize developer directly setting options.DOTENV_KEY\n  if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {\n    return options.DOTENV_KEY\n  }\n\n  // secondary infra already contains a DOTENV_KEY environment variable\n  if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {\n    return process.env.DOTENV_KEY\n  }\n\n  // fallback to empty string\n  return ''\n}\n\nfunction _instructions (result, dotenvKey) {\n  // Parse DOTENV_KEY. Format is a URI\n  let uri\n  try {\n    uri = new URL(dotenvKey)\n  } catch (error) {\n    if (error.code === 'ERR_INVALID_URL') {\n      const err = new Error('INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development')\n      err.code = 'INVALID_DOTENV_KEY'\n      throw err\n    }\n\n    throw error\n  }\n\n  // Get decrypt key\n  const key = uri.password\n  if (!key) {\n    const err = new Error('INVALID_DOTENV_KEY: Missing key part')\n    err.code = 'INVALID_DOTENV_KEY'\n    throw err\n  }\n\n  // Get environment\n  const environment = uri.searchParams.get('environment')\n  if (!environment) {\n    const err = new Error('INVALID_DOTENV_KEY: Missing environment part')\n    err.code = 'INVALID_DOTENV_KEY'\n    throw err\n  }\n\n  // Get ciphertext payload\n  const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`\n  const ciphertext = result.parsed[environmentKey] // DOTENV_VAULT_PRODUCTION\n  if (!ciphertext) {\n    const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`)\n    err.code = 'NOT_FOUND_DOTENV_ENVIRONMENT'\n    throw err\n  }\n\n  return { ciphertext, key }\n}\n\nfunction _vaultPath (options) {\n  let possibleVaultPath = null\n\n  if (options && options.path && options.path.length > 0) {\n    if (Array.isArray(options.path)) {\n      for (const filepath of options.path) {\n        if (fs.existsSync(filepath)) {\n          possibleVaultPath = filepath.endsWith('.vault') ? filepath : `${filepath}.vault`\n        }\n      }\n    } else {\n      possibleVaultPath = options.path.endsWith('.vault') ? options.path : `${options.path}.vault`\n    }\n  } else {\n    possibleVaultPath = path.resolve(process.cwd(), '.env.vault')\n  }\n\n  if (fs.existsSync(possibleVaultPath)) {\n    return possibleVaultPath\n  }\n\n  return null\n}\n\nfunction _resolveHome (envPath) {\n  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath\n}\n\nfunction _configVault (options) {\n  _log('Loading env from encrypted .env.vault')\n\n  const parsed = DotenvModule._parseVault(options)\n\n  let processEnv = process.env\n  if (options && options.processEnv != null) {\n    processEnv = options.processEnv\n  }\n\n  DotenvModule.populate(processEnv, parsed, options)\n\n  return { parsed }\n}\n\nfunction configDotenv (options) {\n  const dotenvPath = path.resolve(process.cwd(), '.env')\n  let encoding = 'utf8'\n  const debug = Boolean(options && options.debug)\n\n  if (options && options.encoding) {\n    encoding = options.encoding\n  } else {\n    if (debug) {\n      _debug('No encoding is specified. UTF-8 is used by default')\n    }\n  }\n\n  let optionPaths = [dotenvPath] // default, look for .env\n  if (options && options.path) {\n    if (!Array.isArray(options.path)) {\n      optionPaths = [_resolveHome(options.path)]\n    } else {\n      optionPaths = [] // reset default\n      for (const filepath of options.path) {\n        optionPaths.push(_resolveHome(filepath))\n      }\n    }\n  }\n\n  // Build the parsed data in a temporary object (because we need to return it).  Once we have the final\n  // parsed data, we will combine it with process.env (or options.processEnv if provided).\n  let lastError\n  const parsedAll = {}\n  for (const path of optionPaths) {\n    try {\n      // Specifying an encoding returns a string instead of a buffer\n      const parsed = DotenvModule.parse(fs.readFileSync(path, { encoding }))\n\n      DotenvModule.populate(parsedAll, parsed, options)\n    } catch (e) {\n      if (debug) {\n        _debug(`Failed to load ${path} ${e.message}`)\n      }\n      lastError = e\n    }\n  }\n\n  let processEnv = process.env\n  if (options && options.processEnv != null) {\n    processEnv = options.processEnv\n  }\n\n  DotenvModule.populate(processEnv, parsedAll, options)\n\n  if (lastError) {\n    return { parsed: parsedAll, error: lastError }\n  } else {\n    return { parsed: parsedAll }\n  }\n}\n\n// Populates process.env from .env file\nfunction config (options) {\n  // fallback to original dotenv if DOTENV_KEY is not set\n  if (_dotenvKey(options).length === 0) {\n    return DotenvModule.configDotenv(options)\n  }\n\n  const vaultPath = _vaultPath(options)\n\n  // dotenvKey exists but .env.vault file does not exist\n  if (!vaultPath) {\n    _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`)\n\n    return DotenvModule.configDotenv(options)\n  }\n\n  return DotenvModule._configVault(options)\n}\n\nfunction decrypt (encrypted, keyStr) {\n  const key = Buffer.from(keyStr.slice(-64), 'hex')\n  let ciphertext = Buffer.from(encrypted, 'base64')\n\n  const nonce = ciphertext.subarray(0, 12)\n  const authTag = ciphertext.subarray(-16)\n  ciphertext = ciphertext.subarray(12, -16)\n\n  try {\n    const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, nonce)\n    aesgcm.setAuthTag(authTag)\n    return `${aesgcm.update(ciphertext)}${aesgcm.final()}`\n  } catch (error) {\n    const isRange = error instanceof RangeError\n    const invalidKeyLength = error.message === 'Invalid key length'\n    const decryptionFailed = error.message === 'Unsupported state or unable to authenticate data'\n\n    if (isRange || invalidKeyLength) {\n      const err = new Error('INVALID_DOTENV_KEY: It must be 64 characters long (or more)')\n      err.code = 'INVALID_DOTENV_KEY'\n      throw err\n    } else if (decryptionFailed) {\n      const err = new Error('DECRYPTION_FAILED: Please check your DOTENV_KEY')\n      err.code = 'DECRYPTION_FAILED'\n      throw err\n    } else {\n      throw error\n    }\n  }\n}\n\n// Populate process.env with parsed values\nfunction populate (processEnv, parsed, options = {}) {\n  const debug = Boolean(options && options.debug)\n  const override = Boolean(options && options.override)\n\n  if (typeof parsed !== 'object') {\n    const err = new Error('OBJECT_REQUIRED: Please check the processEnv argument being passed to populate')\n    err.code = 'OBJECT_REQUIRED'\n    throw err\n  }\n\n  // Set process.env\n  for (const key of Object.keys(parsed)) {\n    if (Object.prototype.hasOwnProperty.call(processEnv, key)) {\n      if (override === true) {\n        processEnv[key] = parsed[key]\n      }\n\n      if (debug) {\n        if (override === true) {\n          _debug(`\"${key}\" is already defined and WAS overwritten`)\n        } else {\n          _debug(`\"${key}\" is already defined and was NOT overwritten`)\n        }\n      }\n    } else {\n      processEnv[key] = parsed[key]\n    }\n  }\n}\n\nconst DotenvModule = {\n  configDotenv,\n  _configVault,\n  _parseVault,\n  config,\n  decrypt,\n  parse,\n  populate\n}\n\nmodule.exports.configDotenv = DotenvModule.configDotenv\nmodule.exports._configVault = DotenvModule._configVault\nmodule.exports._parseVault = DotenvModule._parseVault\nmodule.exports.config = DotenvModule.config\nmodule.exports.decrypt = DotenvModule.decrypt\nmodule.exports.parse = DotenvModule.parse\nmodule.exports.populate = DotenvModule.populate\n\nmodule.exports = DotenvModule\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZG90ZW52L2xpYi9tYWluLmpzIiwibWFwcGluZ3MiOiJBQUFBLFdBQVcsbUJBQU8sQ0FBQyxjQUFJO0FBQ3ZCLGFBQWEsbUJBQU8sQ0FBQyxrQkFBTTtBQUMzQixXQUFXLG1CQUFPLENBQUMsY0FBSTtBQUN2QixlQUFlLG1CQUFPLENBQUMsc0JBQVE7QUFDL0Isb0JBQW9CLG1CQUFPLENBQUMsaUVBQWlCOztBQUU3Qzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDZDQUE2QyxpQkFBaUI7QUFDOUQ7QUFDQSx3REFBd0QsV0FBVztBQUNuRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0IsWUFBWTtBQUM5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QixRQUFRLFVBQVUsUUFBUTtBQUNuRDs7QUFFQTtBQUNBLHlCQUF5QixRQUFRLFVBQVUsUUFBUTtBQUNuRDs7QUFFQTtBQUNBLHlCQUF5QixRQUFRLFdBQVcsUUFBUTtBQUNwRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlDQUF5QywwQkFBMEI7QUFDbkU7QUFDQTtBQUNBLHFGQUFxRixnQkFBZ0I7QUFDckc7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEVBQTBFLFNBQVM7QUFDbkY7QUFDQTtBQUNBLE1BQU07QUFDTiw4RUFBOEUsYUFBYTtBQUMzRjtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRSxVQUFVOztBQUUxRTtBQUNBLE1BQU07QUFDTjtBQUNBLGlDQUFpQyxNQUFNLEVBQUUsVUFBVTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGFBQWE7QUFDYixJQUFJO0FBQ0osYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSx5RUFBeUUsVUFBVTs7QUFFbkY7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYywwQkFBMEIsRUFBRSxlQUFlO0FBQ3pELElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbURBQW1EO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQixJQUFJO0FBQ3pCLFVBQVU7QUFDVixxQkFBcUIsSUFBSTtBQUN6QjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0IsMkJBQTJCO0FBQzNCLDBCQUEwQjtBQUMxQixxQkFBcUI7QUFDckIsc0JBQXNCO0FBQ3RCLG9CQUFvQjtBQUNwQix1QkFBdUI7O0FBRXZCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXByb2plY3Qtd2Vic2l0ZS8uL25vZGVfbW9kdWxlcy9kb3RlbnYvbGliL21haW4uanM/ZmZmMyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IG9zID0gcmVxdWlyZSgnb3MnKVxuY29uc3QgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbmNvbnN0IHBhY2thZ2VKc29uID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJylcblxuY29uc3QgdmVyc2lvbiA9IHBhY2thZ2VKc29uLnZlcnNpb25cblxuY29uc3QgTElORSA9IC8oPzpefF4pXFxzKig/OmV4cG9ydFxccyspPyhbXFx3Li1dKykoPzpcXHMqPVxccyo/fDpcXHMrPykoXFxzKicoPzpcXFxcJ3xbXiddKSonfFxccypcIig/OlxcXFxcInxbXlwiXSkqXCJ8XFxzKmAoPzpcXFxcYHxbXmBdKSpgfFteI1xcclxcbl0rKT9cXHMqKD86Iy4qKT8oPzokfCQpL21nXG5cbi8vIFBhcnNlIHNyYyBpbnRvIGFuIE9iamVjdFxuZnVuY3Rpb24gcGFyc2UgKHNyYykge1xuICBjb25zdCBvYmogPSB7fVxuXG4gIC8vIENvbnZlcnQgYnVmZmVyIHRvIHN0cmluZ1xuICBsZXQgbGluZXMgPSBzcmMudG9TdHJpbmcoKVxuXG4gIC8vIENvbnZlcnQgbGluZSBicmVha3MgdG8gc2FtZSBmb3JtYXRcbiAgbGluZXMgPSBsaW5lcy5yZXBsYWNlKC9cXHJcXG4/L21nLCAnXFxuJylcblxuICBsZXQgbWF0Y2hcbiAgd2hpbGUgKChtYXRjaCA9IExJTkUuZXhlYyhsaW5lcykpICE9IG51bGwpIHtcbiAgICBjb25zdCBrZXkgPSBtYXRjaFsxXVxuXG4gICAgLy8gRGVmYXVsdCB1bmRlZmluZWQgb3IgbnVsbCB0byBlbXB0eSBzdHJpbmdcbiAgICBsZXQgdmFsdWUgPSAobWF0Y2hbMl0gfHwgJycpXG5cbiAgICAvLyBSZW1vdmUgd2hpdGVzcGFjZVxuICAgIHZhbHVlID0gdmFsdWUudHJpbSgpXG5cbiAgICAvLyBDaGVjayBpZiBkb3VibGUgcXVvdGVkXG4gICAgY29uc3QgbWF5YmVRdW90ZSA9IHZhbHVlWzBdXG5cbiAgICAvLyBSZW1vdmUgc3Vycm91bmRpbmcgcXVvdGVzXG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9eKFsnXCJgXSkoW1xcc1xcU10qKVxcMSQvbWcsICckMicpXG5cbiAgICAvLyBFeHBhbmQgbmV3bGluZXMgaWYgZG91YmxlIHF1b3RlZFxuICAgIGlmIChtYXliZVF1b3RlID09PSAnXCInKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcXFxuL2csICdcXG4nKVxuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXFxcci9nLCAnXFxyJylcbiAgICB9XG5cbiAgICAvLyBBZGQgdG8gb2JqZWN0XG4gICAgb2JqW2tleV0gPSB2YWx1ZVxuICB9XG5cbiAgcmV0dXJuIG9ialxufVxuXG5mdW5jdGlvbiBfcGFyc2VWYXVsdCAob3B0aW9ucykge1xuICBjb25zdCB2YXVsdFBhdGggPSBfdmF1bHRQYXRoKG9wdGlvbnMpXG5cbiAgLy8gUGFyc2UgLmVudi52YXVsdFxuICBjb25zdCByZXN1bHQgPSBEb3RlbnZNb2R1bGUuY29uZmlnRG90ZW52KHsgcGF0aDogdmF1bHRQYXRoIH0pXG4gIGlmICghcmVzdWx0LnBhcnNlZCkge1xuICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihgTUlTU0lOR19EQVRBOiBDYW5ub3QgcGFyc2UgJHt2YXVsdFBhdGh9IGZvciBhbiB1bmtub3duIHJlYXNvbmApXG4gICAgZXJyLmNvZGUgPSAnTUlTU0lOR19EQVRBJ1xuICAgIHRocm93IGVyclxuICB9XG5cbiAgLy8gaGFuZGxlIHNjZW5hcmlvIGZvciBjb21tYSBzZXBhcmF0ZWQga2V5cyAtIGZvciB1c2Ugd2l0aCBrZXkgcm90YXRpb25cbiAgLy8gZXhhbXBsZTogRE9URU5WX0tFWT1cImRvdGVudjovLzprZXlfMTIzNEBkb3RlbnZ4LmNvbS92YXVsdC8uZW52LnZhdWx0P2Vudmlyb25tZW50PXByb2QsZG90ZW52Oi8vOmtleV83ODkwQGRvdGVudnguY29tL3ZhdWx0Ly5lbnYudmF1bHQ/ZW52aXJvbm1lbnQ9cHJvZFwiXG4gIGNvbnN0IGtleXMgPSBfZG90ZW52S2V5KG9wdGlvbnMpLnNwbGl0KCcsJylcbiAgY29uc3QgbGVuZ3RoID0ga2V5cy5sZW5ndGhcblxuICBsZXQgZGVjcnlwdGVkXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB0cnkge1xuICAgICAgLy8gR2V0IGZ1bGwga2V5XG4gICAgICBjb25zdCBrZXkgPSBrZXlzW2ldLnRyaW0oKVxuXG4gICAgICAvLyBHZXQgaW5zdHJ1Y3Rpb25zIGZvciBkZWNyeXB0XG4gICAgICBjb25zdCBhdHRycyA9IF9pbnN0cnVjdGlvbnMocmVzdWx0LCBrZXkpXG5cbiAgICAgIC8vIERlY3J5cHRcbiAgICAgIGRlY3J5cHRlZCA9IERvdGVudk1vZHVsZS5kZWNyeXB0KGF0dHJzLmNpcGhlcnRleHQsIGF0dHJzLmtleSlcblxuICAgICAgYnJlYWtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gbGFzdCBrZXlcbiAgICAgIGlmIChpICsgMSA+PSBsZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgIH1cbiAgICAgIC8vIHRyeSBuZXh0IGtleVxuICAgIH1cbiAgfVxuXG4gIC8vIFBhcnNlIGRlY3J5cHRlZCAuZW52IHN0cmluZ1xuICByZXR1cm4gRG90ZW52TW9kdWxlLnBhcnNlKGRlY3J5cHRlZClcbn1cblxuZnVuY3Rpb24gX2xvZyAobWVzc2FnZSkge1xuICBjb25zb2xlLmxvZyhgW2RvdGVudkAke3ZlcnNpb259XVtJTkZPXSAke21lc3NhZ2V9YClcbn1cblxuZnVuY3Rpb24gX3dhcm4gKG1lc3NhZ2UpIHtcbiAgY29uc29sZS5sb2coYFtkb3RlbnZAJHt2ZXJzaW9ufV1bV0FSTl0gJHttZXNzYWdlfWApXG59XG5cbmZ1bmN0aW9uIF9kZWJ1ZyAobWVzc2FnZSkge1xuICBjb25zb2xlLmxvZyhgW2RvdGVudkAke3ZlcnNpb259XVtERUJVR10gJHttZXNzYWdlfWApXG59XG5cbmZ1bmN0aW9uIF9kb3RlbnZLZXkgKG9wdGlvbnMpIHtcbiAgLy8gcHJpb3JpdGl6ZSBkZXZlbG9wZXIgZGlyZWN0bHkgc2V0dGluZyBvcHRpb25zLkRPVEVOVl9LRVlcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ET1RFTlZfS0VZICYmIG9wdGlvbnMuRE9URU5WX0tFWS5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuRE9URU5WX0tFWVxuICB9XG5cbiAgLy8gc2Vjb25kYXJ5IGluZnJhIGFscmVhZHkgY29udGFpbnMgYSBET1RFTlZfS0VZIGVudmlyb25tZW50IHZhcmlhYmxlXG4gIGlmIChwcm9jZXNzLmVudi5ET1RFTlZfS0VZICYmIHByb2Nlc3MuZW52LkRPVEVOVl9LRVkubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBwcm9jZXNzLmVudi5ET1RFTlZfS0VZXG4gIH1cblxuICAvLyBmYWxsYmFjayB0byBlbXB0eSBzdHJpbmdcbiAgcmV0dXJuICcnXG59XG5cbmZ1bmN0aW9uIF9pbnN0cnVjdGlvbnMgKHJlc3VsdCwgZG90ZW52S2V5KSB7XG4gIC8vIFBhcnNlIERPVEVOVl9LRVkuIEZvcm1hdCBpcyBhIFVSSVxuICBsZXQgdXJpXG4gIHRyeSB7XG4gICAgdXJpID0gbmV3IFVSTChkb3RlbnZLZXkpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGVycm9yLmNvZGUgPT09ICdFUlJfSU5WQUxJRF9VUkwnKSB7XG4gICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoJ0lOVkFMSURfRE9URU5WX0tFWTogV3JvbmcgZm9ybWF0LiBNdXN0IGJlIGluIHZhbGlkIHVyaSBmb3JtYXQgbGlrZSBkb3RlbnY6Ly86a2V5XzEyMzRAZG90ZW52eC5jb20vdmF1bHQvLmVudi52YXVsdD9lbnZpcm9ubWVudD1kZXZlbG9wbWVudCcpXG4gICAgICBlcnIuY29kZSA9ICdJTlZBTElEX0RPVEVOVl9LRVknXG4gICAgICB0aHJvdyBlcnJcbiAgICB9XG5cbiAgICB0aHJvdyBlcnJvclxuICB9XG5cbiAgLy8gR2V0IGRlY3J5cHQga2V5XG4gIGNvbnN0IGtleSA9IHVyaS5wYXNzd29yZFxuICBpZiAoIWtleSkge1xuICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcignSU5WQUxJRF9ET1RFTlZfS0VZOiBNaXNzaW5nIGtleSBwYXJ0JylcbiAgICBlcnIuY29kZSA9ICdJTlZBTElEX0RPVEVOVl9LRVknXG4gICAgdGhyb3cgZXJyXG4gIH1cblxuICAvLyBHZXQgZW52aXJvbm1lbnRcbiAgY29uc3QgZW52aXJvbm1lbnQgPSB1cmkuc2VhcmNoUGFyYW1zLmdldCgnZW52aXJvbm1lbnQnKVxuICBpZiAoIWVudmlyb25tZW50KSB7XG4gICAgY29uc3QgZXJyID0gbmV3IEVycm9yKCdJTlZBTElEX0RPVEVOVl9LRVk6IE1pc3NpbmcgZW52aXJvbm1lbnQgcGFydCcpXG4gICAgZXJyLmNvZGUgPSAnSU5WQUxJRF9ET1RFTlZfS0VZJ1xuICAgIHRocm93IGVyclxuICB9XG5cbiAgLy8gR2V0IGNpcGhlcnRleHQgcGF5bG9hZFxuICBjb25zdCBlbnZpcm9ubWVudEtleSA9IGBET1RFTlZfVkFVTFRfJHtlbnZpcm9ubWVudC50b1VwcGVyQ2FzZSgpfWBcbiAgY29uc3QgY2lwaGVydGV4dCA9IHJlc3VsdC5wYXJzZWRbZW52aXJvbm1lbnRLZXldIC8vIERPVEVOVl9WQVVMVF9QUk9EVUNUSU9OXG4gIGlmICghY2lwaGVydGV4dCkge1xuICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihgTk9UX0ZPVU5EX0RPVEVOVl9FTlZJUk9OTUVOVDogQ2Fubm90IGxvY2F0ZSBlbnZpcm9ubWVudCAke2Vudmlyb25tZW50S2V5fSBpbiB5b3VyIC5lbnYudmF1bHQgZmlsZS5gKVxuICAgIGVyci5jb2RlID0gJ05PVF9GT1VORF9ET1RFTlZfRU5WSVJPTk1FTlQnXG4gICAgdGhyb3cgZXJyXG4gIH1cblxuICByZXR1cm4geyBjaXBoZXJ0ZXh0LCBrZXkgfVxufVxuXG5mdW5jdGlvbiBfdmF1bHRQYXRoIChvcHRpb25zKSB7XG4gIGxldCBwb3NzaWJsZVZhdWx0UGF0aCA9IG51bGxcblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnBhdGggJiYgb3B0aW9ucy5wYXRoLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zLnBhdGgpKSB7XG4gICAgICBmb3IgKGNvbnN0IGZpbGVwYXRoIG9mIG9wdGlvbnMucGF0aCkge1xuICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlcGF0aCkpIHtcbiAgICAgICAgICBwb3NzaWJsZVZhdWx0UGF0aCA9IGZpbGVwYXRoLmVuZHNXaXRoKCcudmF1bHQnKSA/IGZpbGVwYXRoIDogYCR7ZmlsZXBhdGh9LnZhdWx0YFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc3NpYmxlVmF1bHRQYXRoID0gb3B0aW9ucy5wYXRoLmVuZHNXaXRoKCcudmF1bHQnKSA/IG9wdGlvbnMucGF0aCA6IGAke29wdGlvbnMucGF0aH0udmF1bHRgXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHBvc3NpYmxlVmF1bHRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICcuZW52LnZhdWx0JylcbiAgfVxuXG4gIGlmIChmcy5leGlzdHNTeW5jKHBvc3NpYmxlVmF1bHRQYXRoKSkge1xuICAgIHJldHVybiBwb3NzaWJsZVZhdWx0UGF0aFxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gX3Jlc29sdmVIb21lIChlbnZQYXRoKSB7XG4gIHJldHVybiBlbnZQYXRoWzBdID09PSAnficgPyBwYXRoLmpvaW4ob3MuaG9tZWRpcigpLCBlbnZQYXRoLnNsaWNlKDEpKSA6IGVudlBhdGhcbn1cblxuZnVuY3Rpb24gX2NvbmZpZ1ZhdWx0IChvcHRpb25zKSB7XG4gIF9sb2coJ0xvYWRpbmcgZW52IGZyb20gZW5jcnlwdGVkIC5lbnYudmF1bHQnKVxuXG4gIGNvbnN0IHBhcnNlZCA9IERvdGVudk1vZHVsZS5fcGFyc2VWYXVsdChvcHRpb25zKVxuXG4gIGxldCBwcm9jZXNzRW52ID0gcHJvY2Vzcy5lbnZcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wcm9jZXNzRW52ICE9IG51bGwpIHtcbiAgICBwcm9jZXNzRW52ID0gb3B0aW9ucy5wcm9jZXNzRW52XG4gIH1cblxuICBEb3RlbnZNb2R1bGUucG9wdWxhdGUocHJvY2Vzc0VudiwgcGFyc2VkLCBvcHRpb25zKVxuXG4gIHJldHVybiB7IHBhcnNlZCB9XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ0RvdGVudiAob3B0aW9ucykge1xuICBjb25zdCBkb3RlbnZQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICcuZW52JylcbiAgbGV0IGVuY29kaW5nID0gJ3V0ZjgnXG4gIGNvbnN0IGRlYnVnID0gQm9vbGVhbihvcHRpb25zICYmIG9wdGlvbnMuZGVidWcpXG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lbmNvZGluZykge1xuICAgIGVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZ1xuICB9IGVsc2Uge1xuICAgIGlmIChkZWJ1Zykge1xuICAgICAgX2RlYnVnKCdObyBlbmNvZGluZyBpcyBzcGVjaWZpZWQuIFVURi04IGlzIHVzZWQgYnkgZGVmYXVsdCcpXG4gICAgfVxuICB9XG5cbiAgbGV0IG9wdGlvblBhdGhzID0gW2RvdGVudlBhdGhdIC8vIGRlZmF1bHQsIGxvb2sgZm9yIC5lbnZcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wYXRoKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnMucGF0aCkpIHtcbiAgICAgIG9wdGlvblBhdGhzID0gW19yZXNvbHZlSG9tZShvcHRpb25zLnBhdGgpXVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25QYXRocyA9IFtdIC8vIHJlc2V0IGRlZmF1bHRcbiAgICAgIGZvciAoY29uc3QgZmlsZXBhdGggb2Ygb3B0aW9ucy5wYXRoKSB7XG4gICAgICAgIG9wdGlvblBhdGhzLnB1c2goX3Jlc29sdmVIb21lKGZpbGVwYXRoKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBCdWlsZCB0aGUgcGFyc2VkIGRhdGEgaW4gYSB0ZW1wb3Jhcnkgb2JqZWN0IChiZWNhdXNlIHdlIG5lZWQgdG8gcmV0dXJuIGl0KS4gIE9uY2Ugd2UgaGF2ZSB0aGUgZmluYWxcbiAgLy8gcGFyc2VkIGRhdGEsIHdlIHdpbGwgY29tYmluZSBpdCB3aXRoIHByb2Nlc3MuZW52IChvciBvcHRpb25zLnByb2Nlc3NFbnYgaWYgcHJvdmlkZWQpLlxuICBsZXQgbGFzdEVycm9yXG4gIGNvbnN0IHBhcnNlZEFsbCA9IHt9XG4gIGZvciAoY29uc3QgcGF0aCBvZiBvcHRpb25QYXRocykge1xuICAgIHRyeSB7XG4gICAgICAvLyBTcGVjaWZ5aW5nIGFuIGVuY29kaW5nIHJldHVybnMgYSBzdHJpbmcgaW5zdGVhZCBvZiBhIGJ1ZmZlclxuICAgICAgY29uc3QgcGFyc2VkID0gRG90ZW52TW9kdWxlLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLCB7IGVuY29kaW5nIH0pKVxuXG4gICAgICBEb3RlbnZNb2R1bGUucG9wdWxhdGUocGFyc2VkQWxsLCBwYXJzZWQsIG9wdGlvbnMpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGRlYnVnKSB7XG4gICAgICAgIF9kZWJ1ZyhgRmFpbGVkIHRvIGxvYWQgJHtwYXRofSAke2UubWVzc2FnZX1gKVxuICAgICAgfVxuICAgICAgbGFzdEVycm9yID0gZVxuICAgIH1cbiAgfVxuXG4gIGxldCBwcm9jZXNzRW52ID0gcHJvY2Vzcy5lbnZcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wcm9jZXNzRW52ICE9IG51bGwpIHtcbiAgICBwcm9jZXNzRW52ID0gb3B0aW9ucy5wcm9jZXNzRW52XG4gIH1cblxuICBEb3RlbnZNb2R1bGUucG9wdWxhdGUocHJvY2Vzc0VudiwgcGFyc2VkQWxsLCBvcHRpb25zKVxuXG4gIGlmIChsYXN0RXJyb3IpIHtcbiAgICByZXR1cm4geyBwYXJzZWQ6IHBhcnNlZEFsbCwgZXJyb3I6IGxhc3RFcnJvciB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHsgcGFyc2VkOiBwYXJzZWRBbGwgfVxuICB9XG59XG5cbi8vIFBvcHVsYXRlcyBwcm9jZXNzLmVudiBmcm9tIC5lbnYgZmlsZVxuZnVuY3Rpb24gY29uZmlnIChvcHRpb25zKSB7XG4gIC8vIGZhbGxiYWNrIHRvIG9yaWdpbmFsIGRvdGVudiBpZiBET1RFTlZfS0VZIGlzIG5vdCBzZXRcbiAgaWYgKF9kb3RlbnZLZXkob3B0aW9ucykubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIERvdGVudk1vZHVsZS5jb25maWdEb3RlbnYob3B0aW9ucylcbiAgfVxuXG4gIGNvbnN0IHZhdWx0UGF0aCA9IF92YXVsdFBhdGgob3B0aW9ucylcblxuICAvLyBkb3RlbnZLZXkgZXhpc3RzIGJ1dCAuZW52LnZhdWx0IGZpbGUgZG9lcyBub3QgZXhpc3RcbiAgaWYgKCF2YXVsdFBhdGgpIHtcbiAgICBfd2FybihgWW91IHNldCBET1RFTlZfS0VZIGJ1dCB5b3UgYXJlIG1pc3NpbmcgYSAuZW52LnZhdWx0IGZpbGUgYXQgJHt2YXVsdFBhdGh9LiBEaWQgeW91IGZvcmdldCB0byBidWlsZCBpdD9gKVxuXG4gICAgcmV0dXJuIERvdGVudk1vZHVsZS5jb25maWdEb3RlbnYob3B0aW9ucylcbiAgfVxuXG4gIHJldHVybiBEb3RlbnZNb2R1bGUuX2NvbmZpZ1ZhdWx0KG9wdGlvbnMpXG59XG5cbmZ1bmN0aW9uIGRlY3J5cHQgKGVuY3J5cHRlZCwga2V5U3RyKSB7XG4gIGNvbnN0IGtleSA9IEJ1ZmZlci5mcm9tKGtleVN0ci5zbGljZSgtNjQpLCAnaGV4JylcbiAgbGV0IGNpcGhlcnRleHQgPSBCdWZmZXIuZnJvbShlbmNyeXB0ZWQsICdiYXNlNjQnKVxuXG4gIGNvbnN0IG5vbmNlID0gY2lwaGVydGV4dC5zdWJhcnJheSgwLCAxMilcbiAgY29uc3QgYXV0aFRhZyA9IGNpcGhlcnRleHQuc3ViYXJyYXkoLTE2KVxuICBjaXBoZXJ0ZXh0ID0gY2lwaGVydGV4dC5zdWJhcnJheSgxMiwgLTE2KVxuXG4gIHRyeSB7XG4gICAgY29uc3QgYWVzZ2NtID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtZ2NtJywga2V5LCBub25jZSlcbiAgICBhZXNnY20uc2V0QXV0aFRhZyhhdXRoVGFnKVxuICAgIHJldHVybiBgJHthZXNnY20udXBkYXRlKGNpcGhlcnRleHQpfSR7YWVzZ2NtLmZpbmFsKCl9YFxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGlzUmFuZ2UgPSBlcnJvciBpbnN0YW5jZW9mIFJhbmdlRXJyb3JcbiAgICBjb25zdCBpbnZhbGlkS2V5TGVuZ3RoID0gZXJyb3IubWVzc2FnZSA9PT0gJ0ludmFsaWQga2V5IGxlbmd0aCdcbiAgICBjb25zdCBkZWNyeXB0aW9uRmFpbGVkID0gZXJyb3IubWVzc2FnZSA9PT0gJ1Vuc3VwcG9ydGVkIHN0YXRlIG9yIHVuYWJsZSB0byBhdXRoZW50aWNhdGUgZGF0YSdcblxuICAgIGlmIChpc1JhbmdlIHx8IGludmFsaWRLZXlMZW5ndGgpIHtcbiAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcignSU5WQUxJRF9ET1RFTlZfS0VZOiBJdCBtdXN0IGJlIDY0IGNoYXJhY3RlcnMgbG9uZyAob3IgbW9yZSknKVxuICAgICAgZXJyLmNvZGUgPSAnSU5WQUxJRF9ET1RFTlZfS0VZJ1xuICAgICAgdGhyb3cgZXJyXG4gICAgfSBlbHNlIGlmIChkZWNyeXB0aW9uRmFpbGVkKSB7XG4gICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoJ0RFQ1JZUFRJT05fRkFJTEVEOiBQbGVhc2UgY2hlY2sgeW91ciBET1RFTlZfS0VZJylcbiAgICAgIGVyci5jb2RlID0gJ0RFQ1JZUFRJT05fRkFJTEVEJ1xuICAgICAgdGhyb3cgZXJyXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGVycm9yXG4gICAgfVxuICB9XG59XG5cbi8vIFBvcHVsYXRlIHByb2Nlc3MuZW52IHdpdGggcGFyc2VkIHZhbHVlc1xuZnVuY3Rpb24gcG9wdWxhdGUgKHByb2Nlc3NFbnYsIHBhcnNlZCwgb3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IGRlYnVnID0gQm9vbGVhbihvcHRpb25zICYmIG9wdGlvbnMuZGVidWcpXG4gIGNvbnN0IG92ZXJyaWRlID0gQm9vbGVhbihvcHRpb25zICYmIG9wdGlvbnMub3ZlcnJpZGUpXG5cbiAgaWYgKHR5cGVvZiBwYXJzZWQgIT09ICdvYmplY3QnKSB7XG4gICAgY29uc3QgZXJyID0gbmV3IEVycm9yKCdPQkpFQ1RfUkVRVUlSRUQ6IFBsZWFzZSBjaGVjayB0aGUgcHJvY2Vzc0VudiBhcmd1bWVudCBiZWluZyBwYXNzZWQgdG8gcG9wdWxhdGUnKVxuICAgIGVyci5jb2RlID0gJ09CSkVDVF9SRVFVSVJFRCdcbiAgICB0aHJvdyBlcnJcbiAgfVxuXG4gIC8vIFNldCBwcm9jZXNzLmVudlxuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhwYXJzZWQpKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwcm9jZXNzRW52LCBrZXkpKSB7XG4gICAgICBpZiAob3ZlcnJpZGUgPT09IHRydWUpIHtcbiAgICAgICAgcHJvY2Vzc0VudltrZXldID0gcGFyc2VkW2tleV1cbiAgICAgIH1cblxuICAgICAgaWYgKGRlYnVnKSB7XG4gICAgICAgIGlmIChvdmVycmlkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIF9kZWJ1ZyhgXCIke2tleX1cIiBpcyBhbHJlYWR5IGRlZmluZWQgYW5kIFdBUyBvdmVyd3JpdHRlbmApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2RlYnVnKGBcIiR7a2V5fVwiIGlzIGFscmVhZHkgZGVmaW5lZCBhbmQgd2FzIE5PVCBvdmVyd3JpdHRlbmApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcHJvY2Vzc0VudltrZXldID0gcGFyc2VkW2tleV1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgRG90ZW52TW9kdWxlID0ge1xuICBjb25maWdEb3RlbnYsXG4gIF9jb25maWdWYXVsdCxcbiAgX3BhcnNlVmF1bHQsXG4gIGNvbmZpZyxcbiAgZGVjcnlwdCxcbiAgcGFyc2UsXG4gIHBvcHVsYXRlXG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbmZpZ0RvdGVudiA9IERvdGVudk1vZHVsZS5jb25maWdEb3RlbnZcbm1vZHVsZS5leHBvcnRzLl9jb25maWdWYXVsdCA9IERvdGVudk1vZHVsZS5fY29uZmlnVmF1bHRcbm1vZHVsZS5leHBvcnRzLl9wYXJzZVZhdWx0ID0gRG90ZW52TW9kdWxlLl9wYXJzZVZhdWx0XG5tb2R1bGUuZXhwb3J0cy5jb25maWcgPSBEb3RlbnZNb2R1bGUuY29uZmlnXG5tb2R1bGUuZXhwb3J0cy5kZWNyeXB0ID0gRG90ZW52TW9kdWxlLmRlY3J5cHRcbm1vZHVsZS5leHBvcnRzLnBhcnNlID0gRG90ZW52TW9kdWxlLnBhcnNlXG5tb2R1bGUuZXhwb3J0cy5wb3B1bGF0ZSA9IERvdGVudk1vZHVsZS5wb3B1bGF0ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IERvdGVudk1vZHVsZVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/dotenv/lib/main.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/dotenv/package.json":
/*!******************************************!*\
  !*** ./node_modules/dotenv/package.json ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"dotenv","version":"16.4.5","description":"Loads environment variables from .env file","main":"lib/main.js","types":"lib/main.d.ts","exports":{".":{"types":"./lib/main.d.ts","require":"./lib/main.js","default":"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.js","./package.json":"./package.json"},"scripts":{"dts-check":"tsc --project tests/types/tsconfig.json","lint":"standard","lint-readme":"standard-markdown","pretest":"npm run lint && npm run dts-check","test":"tap tests/*.js --100 -Rspec","test:coverage":"tap --coverage-report=lcov","prerelease":"npm test","release":"standard-version"},"repository":{"type":"git","url":"git://github.com/motdotla/dotenv.git"},"funding":"https://dotenvx.com","keywords":["dotenv","env",".env","environment","variables","config","settings"],"readmeFilename":"README.md","license":"BSD-2-Clause","devDependencies":{"@definitelytyped/dtslint":"^0.0.133","@types/node":"^18.11.3","decache":"^4.6.1","sinon":"^14.0.1","standard":"^17.0.0","standard-markdown":"^7.1.0","standard-version":"^9.5.0","tap":"^16.3.0","tar":"^6.1.11","typescript":"^4.8.4"},"engines":{"node":">=12"},"browser":{"fs":false}}');

/***/ })

};
;