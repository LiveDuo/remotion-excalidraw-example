// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: The configuration file does only apply if you render via the CLI !


import { Config } from 'remotion';

Config.setImageFormat('jpeg');
Config.setOverwriteOutput(true);

Config.overrideWebpackConfig((currentConfiguration) => {
    return {
        ...currentConfiguration,
        module: {
            ...currentConfiguration.module,
            rules: [
                ...(currentConfiguration.module?.rules ?? []),
                { test: /\.excalidraw$/, type: 'json' },
            ],
            
        },
    };
});
