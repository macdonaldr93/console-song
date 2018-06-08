import sourcemaps from 'rollup-plugin-sourcemaps';

export default (name, override = {}) => {
  const config = Object.assign(
    {
      input: 'lib/index.js',
      //output: merged separately
      onwarn,
      external: Object.keys(globals),
    },
    override,
  );

  config.output = Object.assign(
    {
      file: 'lib/bundle.umd.js',
      format: 'umd',
      name,
      exports: 'named',
      sourcemap: true,
      globals,
    },
    config.output,
  );

  config.plugins = config.plugins || [];
  config.plugins.push(sourcemaps());
  return config;
};
