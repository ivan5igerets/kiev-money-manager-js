export default {
    state: () => ({
        month: '',
    }),
    mutations: {
        setMonth(state, newMonth) {
            state.month = newMonth;
        }
    }
}