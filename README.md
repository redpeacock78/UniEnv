# UniEnv

***Unified environment variable management for Node.js, Deno, and Bun.***

## Usage
- ### Code
  ### Node.js and Bun
  ```javascript
  import UniEnv from 'unienv';
  ```

  ### Deno
  ```typescript
  import UniEnv from "npm:unienv";
  ```

  ### Example
  ```javascript
  // Referenced from .env file
  const getEnv = UniEnv.get('EXAMPLE');
  console.log(`${getEnv.isOk() ? getEnv.value : getEnv.error}`);

  // Set, reference, and delete environment variables
  const setKey = UniEnv.set('KEY', 'value');
  if (setKey.isNg()) console.error(setKey.error);
  const getKey = UniEnv.get('KEY');
  console.log(`${getKey.isOk() ? getKey.value : getKey.error}`);
  const rmKey = UniEnv.delete('KEY');
  if (rmKey.isNg()) console.error(rmKey.error);
  ```

- ### Run
  ### Node.js
  ```bash
  node index.js
  ```
  ### Bun
  ```bash
  bun run index.js
  ```
  ### Deno
  ```bash
  deno run --allow-read --allow-env index.ts
  ```

## Runtime Version Requirements
|Node.js|Bun|Deno|
|:-:|:-:|:-:|
|✅ `12.0.0` or higher|✅ `1.0` or higher|✅ `1.30.0` or higher|
