function r(r){try{if(!r)return;return JSON.parse(atob(r.split(".")[1]))}catch(r){return void console.error(r)}}

export { r };
