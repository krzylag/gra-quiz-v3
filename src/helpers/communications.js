import Axios from 'axios';
import { SERVER_URL } from '../index';

class Communications {
    
    fetchGroupsList() {
        return new Promise(function(resolve,reject) {
            Axios.get(SERVER_URL, {
                params: {
                    action: 'groups-list'
                }
            }).then((response)=>{
                if (response.data.result) {
                    let result = {};
                    for (var key in response.data.groups) {
                        result[response.data.groups[key].pin]=response.data.groups[key];
                    }
                    resolve(result);
                } else {
                    console.error(response.data);
                    reject(response.data);
                }
            }).catch((error)=>{
                console.error(error.data);
                reject(error);
            })
        });
    }
    
    fetchPackagesList() {
        return new Promise(function(resolve,reject) {
            Axios.get(SERVER_URL, {
                params: {
                    action: 'packages-list'
                }
            }).then((response)=>{
                if (response.data.result) {
                    let result = {};
                    for (var key in response.data.packages) {
                        result[response.data.packages[key].hash]=response.data.packages[key];
                    }
                    resolve(result);
                } else {
                    console.error(response.data);
                    reject(response.data);
                }
            }).catch((error)=>{
                console.error(error.data);
                reject(error);
            })
        });
    }
    
    fetchPackage(tryHash) {
        return new Promise(function(resolve,reject) {
            Axios.get(SERVER_URL, {
                params: {
                    action: 'package-get',
                    hash: tryHash
                }
            }).then((response)=>{
                if (response.data.result) {
                    resolve(response.data.package);
                } else {
                    console.error(response.data);
                    reject(response.data);
                }
            }).catch((error)=>{
                console.error(error.data);
                reject(error);
            })
        });
    }
    
    fetchReport(tryHash, tryPin) {
        return new Promise(function(resolve,reject) {
            Axios.get(SERVER_URL, {
                params: {
                    action: 'report-get',
                    hash: tryHash,
                    pin: tryPin
                }
            }).then((response)=>{
                if (response.data.result) {
                    resolve(response.data.users);
                } else {
                    console.error(response.data);
                    reject(response.data);
                }
            }).catch((error)=>{
                console.error(error.data);
                reject(error);
            })
        });
    }


    validateNewLogin(tryPin, tryName) {
        return new Promise(function(resolve,reject) {
            Axios.post(SERVER_URL, {
                action: 'validate-new-login',
                pin: tryPin,
                name: tryName
            }).then((response)=>{
                if (response.data.result) {
                    resolve(response.data);
                } else if (!response.data.result && typeof(response.data.reason)!=='undefined') {
                    reject(response.data.reason);
                } else {
                    reject();
                }
            }).catch((error)=>{
                console.error(error.data);
                reject(error.data);
            });
        });
    }

    uploadAnswer(userId, userAnswers) {
        return new Promise(function(resolve,reject) {
            Axios.post(SERVER_URL, {
                action: 'answer-upload',
                userid: userId,
                answers: userAnswers
            }).then((response)=>{
                resolve();
            }).catch((error)=>{
                console.error(error.data);
                reject();
            })
        });
    }

    cleanGroup(tryPin) {
        return new Promise(function(resolve,reject) {
            Axios.post(SERVER_URL, {
                action: 'group-clean',
                pin: tryPin
            }).then((response)=>{
                if (response.data.result) {
                    resolve();
                } else {
                    reject();
                }
            }).catch((error)=>{
                console.error(error.data);
                reject();
            })
        });
    }

    createGroup(newName, hash) {
        return new Promise(function(resolve,reject) {
            Axios.post(SERVER_URL, {
                action: 'create-group',
                name: newName.trim(),
                package: hash 
            }).then((response)=>{
                if (response.data.result) {
                    resolve();
                } else {
                    reject();
                }
            }).catch((error)=>{
                console.error(error.data);
                reject();
            })
        });
    }

    deleteGroup(tryPin) {
        return new Promise(function(resolve,reject) {
            Axios.post(SERVER_URL, {
                action: 'group-delete',
                pin: tryPin
            }).then((response)=>{
                if (response.data.result) {
                    resolve();
                } else {
                    reject();
                }
            }).catch((error)=>{
                console.error(error.data);
                reject();
            })
        });
    }

    updateHash(tryPin, newHash) {
        return new Promise(function(resolve,reject) {
            Axios.post(SERVER_URL, {
                action: 'group-hash-update',
                pin: tryPin,
                hash: newHash
            }).then((response)=>{
                if (response.data.result) {
                    resolve();
                } else {
                    reject();
                }
            }).catch((error)=>{
                console.error(error.data);
                reject();
            })
        });
    }

    updatePin(oldPin, newPin) {
        return new Promise(function(resolve,reject) {
            Axios.post(SERVER_URL, {
                action: 'group-pin-update',
                oldpin: oldPin,
                newpin: newPin
            }).then((response)=>{
                if (response.data.result) {
                    resolve();
                } else {
                    reject();
                }
            }).catch((error)=>{
                console.error(error.data);
                reject();
            })
        });
    }


}

export let comms = new Communications();
