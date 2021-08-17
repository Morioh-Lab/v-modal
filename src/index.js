import Plugin from './plugin.vue';

export default {
    install: function (vm, config) {
        vm.component(Plugin.name, Plugin);        
    }
};

export { Plugin };