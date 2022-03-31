import axios from "axios";
const apiEndpoint = "https://bancov-tarlac-website.herokuapp.com";
// const apiEndpoint = "http://localhost:5000";
// const apiEndpoint = "http://localhost:8888";

const adminLogin = (userData) => {
    const data = {email:userData.email, password: userData.password}
    return axios.post(`${apiEndpoint}/admin/login`, data, {
        withCredentials: true,
    });
}

const logoutAdmin = (data) =>{
    return axios.post(`${apiEndpoint}/admin/logout`, data, {
        withCredentials: true,
    });
}

const getCurrentData = () => {
    return axios.get(`${apiEndpoint}/covid/viewCurrentData`);
}

const uploadCurrentData = (data) => {
    const covidData = {"currentDateUploaded": data.date,
     "currentNewCasesBreakdown": data.covidCases,
      "currentRecoveriesBreakdown": data.covidRecoveries, 
      "currentDeathsBreakdown": data.covidDeaths,
       "overallActiveCasesBreakdown": data.newCasesObject }
    return axios.put(`${apiEndpoint}/covid/uploadCurrentData`, covidData, {
        withCredentials: true,
    });
}

const viewAllAdmins = () => {
    return axios.get(`${apiEndpoint}/admin/viewAllAdmins`, {
        withCredentials: true,
    });
}

const addAdmin = (data) => {
    return axios.post(`${apiEndpoint}/admin/addAdmin`, data, {
        withCredentials: true,
    });
}

const updateAdmin = (data) =>{
    return axios.put(`${apiEndpoint}/admin/updateAdmin`, data, {
        withCredentials: true,
    });
}

const deleteAdmin = data =>{
    return axios.delete(`${apiEndpoint}/admin/deleteAdmin/${data.email}`,{
        withCredentials: true,
    });
}

const viewAllData = () => {
    return axios.get(`${apiEndpoint}/covid/viewAllData`, {
        withCredentials: true,
    });
}

const updateData = (data, userInfo) =>{
    const upData = {"data": data, "userInfo": userInfo}
    return axios.put(`${apiEndpoint}/covid/changeOverallCovidData`, upData, {
        withCredentials: true,
    });
}

const updateHistory = (data, userInfo) =>{
    const upData = {data, userInfo}
    return axios.put(`${apiEndpoint}/covid/updateCovidHistory`, upData, {
        withCredentials: true,
    });
}
  
const httpServices = {
   adminLogin,
   getCurrentData,
   logoutAdmin,
   uploadCurrentData,
   addAdmin,
    viewAllAdmins,
    updateAdmin,
    deleteAdmin,
    viewAllData,
    updateData,
    updateHistory
  };
  
  export default httpServices;