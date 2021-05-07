export default {
    namespaced: true,
    state: () => ({
        month: '',
    }),
    mutations: {
        setMonth(state, newMonth) {
            state.month = newMonth;
        }
    }
}