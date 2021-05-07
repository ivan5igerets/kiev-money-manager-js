export default {
    state: () => ({ 
        name: '',
        email: '',
        isLoading: true,   
    }),
    mutations: {
        setName(state, newName) {
            state.name = newName;
        },
        
        setEmail(state, newEmail) {
            state.email = newEmail;
        },
      
        loadingToggle(state, newValue) {
            state.isLoading = newValue;
        }
    },
  }