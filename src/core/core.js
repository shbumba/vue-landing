"use strict";

import DebuggingPlugin from './plugins/debugging';
import Options from './options';

export default (() => {
  "use strict";

  let __option = Options;

  const __methods = {
    registerPlugins(pluginList) {
      for (let pluginName in pluginList) {
        let plugin = pluginList[pluginName];

        if (!plugin.install) {
          continue;
        }

        Vue.use(plugin.install);
      }
    },

    async setPluginOption(pluginList) {
      for (let pluginName in pluginList) {
        let plugin = pluginList[pluginName];

        if (plugin.name && plugin.setOptions) {
          await plugin.setOptions(__option.plugin[plugin.name]);
        }
      }
    }
  };

  return {
    plugins: {
      Debugging: DebuggingPlugin
    },
    addPlugins(plugins) {
      this.plugins = {
        ...this.plugins,
        ...plugins
      }

      return this;
    },
    setOption(options) {
      __option = (options) ? Object.assign({}, __option, options) : __option;

      return this;
    },
    async run(callback) {
      if (__option.vueDebug) {
        Vue.config.devtools = true;
      }

      await __methods.setPluginOption(this.plugins);

      DebuggingPlugin.log('Core: Register plugins');

      await __methods.registerPlugins(this.plugins);

      if (callback) {
        await callback();
      }
    }
  };
})();
