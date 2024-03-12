import '../../chunks/index-f253f80e.js';
import '../../chunks/storage-e7df8ba2.js';
import '../../chunks/connectRuntime-46c719de.js';
import { o } from '../../chunks/background.content-af299dd5.js';
import { e } from '../../chunks/when_ready.util-de193783.js';

e((async()=>{var t;const e=new o,s=null===(t=document.getElementById("jwt-response"))||void 0===t?void 0:t.textContent;s&&e.fetch("/auth/finish-link",s);}));
