import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  webpack: (config) => {
    // Remove the original rule for .py files, which is too broad.
    const pyRuleIndex = config.module.rules.findIndex(
      (rule) =>
        Object.prototype.hasOwnProperty.call(rule, 'test') &&
        rule.test instanceof RegExp &&
        rule.test.toString() === '/\.py$/'
    );
    if (pyRuleIndex > -1) {
      config.module.rules.splice(pyRuleIndex, 1);
    }

    // Add a more specific rule for .py files in the template directory.
    config.module.rules.push({
      test: /\.py$/,
      include: [
        path.resolve(__dirname, 'src/lib/blockly/workspace/blocks/template'),
      ],
      type: 'asset/source',
    });

    // For .json files in the samples directory, we want to treat them as resources.
    // We add this rule at the beginning so it's evaluated before the default JSON loader.
    config.module.rules.unshift({
      test: /\.json$/,
      include: [path.resolve(__dirname, 'src/lib/blockly/samples')],
      type: 'asset/resource',
      generator: {
        filename: 'static/samples/[name][ext]',
      },
    });

    return config;
  },
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;