// TODO: ログイン機能の追加
export function setupLogin(appMenu) {

    window.addEventListener('load', function(){
        setTimeout(function(){ 
            if(document.getElementById("atk").value == ''){
              appMenu.subLayerGui.hide();
              $(".get_data").hide();
            }else{
              appMenu.subLayerGui.show();
              $(".get_data").show();
            }
            //alert(document.getElementById("atk").value);
            }, 1000);
        //alert(document.getElementById("atk").value);
    });

    // ログイン処理
    document.getElementById("qsLoginBtn").addEventListener("click", function() {
        login();
    });

    // ログアウト処理
    document.getElementById("qsLogoutBtn").addEventListener("click", function() {
        logout();
    });
}


// The Auth0 client, initialized in configureClient()
let auth0 = null;
let accessToken = "";

const app_path = "itowns_template/";
// const app_path = "";

/**
 * Starts the authentication flow
 */
const login = async (targetUrl) => {
  try {
    console.log("Logging in", targetUrl);

    let op_temp = window.location.origin

    if(app_path != ""){
      op_temp = window.location.origin + "/" + app_path
    }

    const options = {
        redirect_uri: op_temp
    };

    if (targetUrl) {
      options.appState = { targetUrl };
    }

    if(auth0 != null){
      await auth0.loginWithRedirect(options);
    }else{
      console.log("Log in failed auth0 is null.");
    }

  } catch (err) {
    console.log("Log in failed", err);
  }
};

/**
 * Executes the logout flow
 */
const logout = () => {
    try {
        console.log("Logging out");
        // returnTo: window.location.origin
        auth0.logout({
            returnTo: window.location.origin + "/" + app_path
        });
    } catch (err) {
        console.log("Log out failed", err);
    }
};

/**
 * Retrieves the auth configuration from the server
 */

let temp_root = "";
if(app_path != ""){
    temp_root = "/" + app_path
}
//const fetchAuthConfig = () => fetch(temp_root + "/auth_config.json?date=20220107_2");
//geo
const fetchAuthConfig = () => fetch(location.pathname + "/auth_config.json?date=20220107_2");

/**
 * Initializes the Auth0 client
 */
const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
        
    console.log("configureClient config",config.domain);

    try {
        auth0 = await createAuth0Client({
            domain: config.domain,
            audience : config.audience,
            client_id: config.clientId,
            cacheLocation: 'localstorage'
        });

        console.log("auth0 is activate.(not localstorage)");

    } catch (err) {
        console.log("auth0 is NOT activate.");
        console.log("configureClient failed", err);
    }
};

/**
 * Checks to see if the user is authenticated. If so, `fn` is executed. Otherwise, the user
 * is prompted to log in
 * @param {*} fn The function to execute if the user is logged in
 */
const requireAuth = async (fn, targetUrl) => {
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        return fn();
    }

    return login(targetUrl);
};

// Will run when page finishes loading
window.onload = async () => {
    console.log("window.onload");
    await configureClient();

    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        console.log("> User is authenticated");
        //window.history.replaceState({}, document.title, window.location.pathname);
        updateUI();
        return;
    }

    console.log("> User is not until authenticated");

    console.log("window.location:",window.location);

    const query = window.location.search;
    console.log("query:", query);
    const shouldParseResult = query.includes("code=") && query.includes("state=");

    if (shouldParseResult) {
        console.log("> Parsing redirect");
        try {
            const result = await auth0.handleRedirectCallback();

            if (result.appState && result.appState.targetUrl) {
                showContentFromUrl(result.appState.targetUrl);
            }

            console.log("Logged in!");

        } catch (err) {
            console.log("Error parsing redirect:", err);
        }

        //window.history.replaceState({}, document.title, "/" + app_path);
    } else {
        console.log("query is null.");
    }

    updateUI();
};

// URL mapping, from hash to a function that responds to that URL action
const router = {
    "/": () => showContent("content-home"),
    // "/profile": () =>
    //   requireAuth(() => showContent("content-profile"), "/profile"),
    "/login": () => login()
  };
  
  //Declare helper functions
  
  /**
   * Iterates over the elements matching 'selector' and passes them
   * to 'fn'
   * @param {*} selector The CSS selector to find
   * @param {*} fn The function to execute for every element
   */
  const eachElement = (selector, fn) => {
    for (let e of document.querySelectorAll(selector)) {
      fn(e);
    }
  };
  
  /**
   * Tries to display a content panel that is referenced
   * by the specified route URL. These are matched using the
   * router, defined above.
   * @param {*} url The route URL
   */
  const showContentFromUrl = (url) => {
    if (router[url]) {
      router[url]();
      return true;
    }
  
    return false;
  };
  
  /**
   * Returns true if `element` is a hyperlink that can be considered a link to another SPA route
   * @param {*} element The element to check
   */
  const isRouteLink = (element) =>
    element.tagName === "A" && element.classList.contains("route-link");
  
  /**
   * Displays a content panel specified by the given element id.
   * All the panels that participate in this flow should have the 'page' class applied,
   * so that it can be correctly hidden before the requested content is shown.
   * @param {*} id The id of the content to show
   */
  const showContent = (id) => {
    eachElement(".page", (p) => p.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
  };
  
  /**
   * Updates the user interface
   */
  const updateUI = async () => {
    try {
      const isAuthenticated = await auth0.isAuthenticated();
  
      if (isAuthenticated) {
        const user = await auth0.getUser();
  
        if (document.getElementById("profile-data") != null){
          document.getElementById("profile-data").innerText = JSON.stringify(
            user,
            null,
            2
          );
   
        }
  
        eachElement(".profile-image", (e) => (e.src = user.picture));
        eachElement(".user-name", (e) => (e.innerText = user.name));
        // eachElement(".user-email", (e) => (e.innerText = user.email));
        eachElement(".auth-invisible", (e) => e.classList.add("hidden"));
        eachElement(".auth-visible", (e) => e.classList.remove("hidden"));
  
        accessToken = await auth0.getTokenSilently();
          console.log("accessToken(must be JWT)", accessToken);
        //document.getElementById("map").contentWindow.accessToken = accessToken;
        document.getElementById("atk").value = accessToken;
  // API TEST
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "/api/v1/test",
          "method": "GET",
          "headers": {
          "authorization": "Bearer " + accessToken
          }
        }
  
        $.ajax(settings).done(function (response) {
          console.log(response);
        });
        update_MAP();
  
      } else {
        eachElement(".auth-invisible", (e) => e.classList.remove("hidden"));
        eachElement(".auth-visible", (e) => e.classList.add("hidden"));
        accessToken = "";
      }
    } catch (err) {
      console.log("Error updating UI!", err);
      return;
    }
  
    console.log("UI updated");
  };
  
  window.onpopstate = (e) => {
    if (e.state && e.state.url && router[e.state.url]) {
      showContentFromUrl(e.state.url);
    }
  };
  
  const update_MAP = async () => {
    if (accessToken != ""){
       console.log("update_MAP");
    }
  }
  