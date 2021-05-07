import api from '@/api/auth'

export default {
    namespaced: true,
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
    actions: {
        FETCH_DATA({commit}) {
            api.getUser().then(res => {
                console.log('action', res);
                commit('setName', res.data.name);
                commit('setEmail', res.data.email);
            })
        }
    },
  }