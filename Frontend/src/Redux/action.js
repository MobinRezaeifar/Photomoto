export const addRegiaterSuccess = (user) => ({
    type: 'ADD_REGISTER_SUCCESS',
    payload: user,
  });
  
  export const fetchRegistersSuccess = (users) => ({
    type: 'FETCH_REGISTERS_SUCCESS',
    payload: users,
  });
  
  export const updateRegisterSuccess = (updatedUser) => ({
    type: 'UPDATE_REGISTER_SUCCESS',
    payload: updatedUser,
  });
  
  export const deleteRegisterSuccess = (id) => ({
    type: 'DELETE_REGISTER_SUCCESS',
    payload: id,
  });
  

  
  export const AddRegister = (newUser) => {
    return async (dispatch) => {
      try {
        const response = await fetch('https://localhost:7028/api/Registers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });
  
        const register = await response.json();
        dispatch(addRegiaterSuccess(register));
      } catch (error) {
        console.error('Error adding register:', error);
      }
    };
  };
  
  export const fetchRegister = () => {
    return async (dispatch) => {
      try {
        const response = await fetch('https://localhost:7028/api/Registers');
        const register = await response.json();
        dispatch(fetchRegistersSuccess(register));
      } catch (error) {
        console.error('Error fetching register:', error);
      }
    };
  };
  
  export const updateRegister = (id, updatedRegister) => {
    return async (dispatch) => {
      try {
        const response = await fetch(`https://localhost:7028/api/Registers/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRegister),
        });
  
        const register = await response.json();
        dispatch(updateRegisterSuccess(register));
      } catch (error) {
        console.error(`Error updating register with ID ${id}:`, error);
      }
    };
  };
  
  export const deleteRegister = (id) => {
    return async (dispatch) => {
      try {
        await fetch(`https://localhost:7028/api/Registers/${id}`, {
          method: 'DELETE',
        });
  
        dispatch(deleteRegisterSuccess(id));
      } catch (error) {
        console.error(`Error deleting register with ID ${id}:`, error);
      }
    };
  };
  
  
 