<template>
    <transition appear @enter="show">
        <div class="fixed z-30 inset-0 overflow-hidden overflow-y-auto" role="dialog" aria-modal="true" v-if="open">
            <transition :name="backdrop.transition" @after-leave="hide" @after-enter="show">
                <div v-if="status.BACKDROP" :class="backdrop.class" aria-hidden="true" @click="close">
                </div>
            </transition>

            <transition :name="transition" @after-leave="hide">
                <template v-if="status.CONTENT">
                    <slot></slot>
                </template>
            </transition>

        </div>
    </transition>
</template>

<script>

    import { onMounted, onBeforeUnmount, reactive, nextTick } from 'vue';

    export default {
        name: 'modal',

        props: {
            // modelValue: Boolean,
            static: { type: Boolean, default: () => false },
            backdrop: {
                type: Object,
                default: () => {
                    return {
                        transition: 'fade',
                        class: 'fixed inset-0 bg-black bg-opacity-50 transition',
                    }
                }
            },

            open: Boolean,

            transition: { type: String, default: () => 'fade' },
        },
        emits: ['show', 'hide', 'destroy'],

        setup(props, { emit }) {

            let status = reactive({ BACKDROP: 0, CONTENT: 0 });

            const hide = () => {

                if (props.backdrop && status.CONTENT) {
                    status.CONTENT = 0;
                    return;
                }

                status.BACKDROP = 0;
                nextTick().then(() => {
                    document.body.classList.remove('overflow-hidden');
                    emit('hide');
                });
            }


            const show = () => {

                // console.log(status);
                document.body.classList.add('overflow-hidden');
                if (props.backdrop && !status.BACKDROP) {
                    status.BACKDROP = 1;
                    return;
                }
                status.CONTENT = 1;

                emit('show');
            }

            const close = () => {
                if (props.static) return;
                hide();
            }

            const keydown = (e) => {
                if (!props.open) return;
                if (e.keyCode == 27) {
                    hide();
                }
            }

            onMounted(() => {

                document.addEventListener('keydown', keydown);
            });

            onBeforeUnmount(() => {

                document.removeEventListener('keydown', keydown);
                document.body.classList.remove('overflow-hidden');
                emit('destroy');
            })

            return { close, show, hide, status };

        }

    }

</script>