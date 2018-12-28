<script>
    function capitalizeFirstLetter(s) {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    export default {
        props: {
            title: {
                type: String,
                required: true
            }
        },
        watch: {
            title: {
                handler() {
                    document.title = capitalizeFirstLetter(this.title) + ' - Camptocamp.org'
                },
                immediate: true
            }
        },

        render() {
            return ''
        }
    }
</script>
