/*
 * Copyright © 2015-2016 Antergos
 *
 * mock.js
 *
 * This file is part of lightdm-webkit2-greeter
 *
 * lightdm-webkit2-greeter is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License,
 * or any later version.
 *
 * lightdm-webkit2-greeter is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * The following additional terms are in effect as per Section 7 of the license:
 *
 * The preservation of all legal notices and author attributions in
 * the material or in the Appropriate Legal Notices displayed
 * by works containing it is required.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


if ('lightdm' in window) {
    throw new Error('Cannot use LightDM Mock while the greeter is running!');
}


/** @ignore */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


/**
 * @namespace window
 */

/**
 * @memberOf window
 * @type {LightDM.LightDMGreeter}
 */
let lightdm = null;

/**
 * @memberOf window
 * @type {LightDM.GreeterUtil}
 */
let greeter_util = null;

/**
 * @memberOf window
 * @type {LightDM.ConfigFile}
 */
let config = null;


/**
 * @namespace LightDM
 */

/**
 * Interface for object that holds info about a session. Session objects are not
 * created by the theme's code, but rather by the {@link LightDMGreeter} class.
 * @memberOf LightDM
 */
class LightDMSession {
    constructor({
        comment,
        key,
        name
    }) {
        /**
         * The comment for the session.
         * @type {String}
         * @readonly
         */
        this.comment = comment;

        /**
         * The key for the session.
         * @type {String}
         * @readonly
         */
        this.key = key;

        /**
         * The name for the session.
         * @type {String}
         * @readonly
         */
        this.name = name;
    }
}


/**
 * Interface for object that holds info about a language on this system. Language objects are not
 * created by the theme's code, but rather by the {@link LightDMGreeter} class.
 * @memberOf LightDM
 */
class LightDMLanguage {
    constructor({
        code,
        name,
        territory
    }) {
        /**
         * The code for the language.
         * @type {String}
         * @readonly
         */
        this.code = code;

        /**
         * The name for the language.
         * @type {String}
         * @readonly
         */
        this.name = name;

        /**
         * The territory for the language.
         * @type {String}
         * @readonly
         */
        this.territory = territory;
    }
}


/**
 * Interface for object that holds info about a keyboard layout on this system. Language
 * objects are not created by the theme's code, but rather by the {@link LightDMGreeter} class.
 * @memberOf LightDM
 */
class LightDMLayout {
    constructor({
        description,
        name,
        short_description
    }) {
        /**
         * The description for the layout.
         * @type {String}
         * @readonly
         */
        this.description = description;

        /**
         * The name for the layout.
         * @type {String}
         * @readonly
         */
        this.name = name;

        /**
         * The territory for the layout.
         * @type {String}
         * @readonly
         */
        this.short_description = short_description;
    }
}


/**
 * Interface for object that holds info about a user account on this system. User
 * objects are not created by the theme's code, but rather by the {@link LightDMGreeter} class.
 * @memberOf LightDM
 */
class LightDMUser {
    constructor(user_info) {
        /**
         * The display name for the user.
         * @type {String}
         * @readonly
         */
        this.display_name = user_info.display_name;

        /**
         * The language for the user.
         * @type {String}
         * @readonly
         */
        this.language = user_info.language;

        /**
         * The keyboard layout for the user.
         * @type {String}
         * @readonly
         */
        this.layout = user_info.layout;

        /**
         * The image for the user.
         * @type {String}
         * @readonly
         */
        this.image = user_info.image;

        /**
         * The home_directory for the user.
         * @type {String}
         * @readonly
         */
        this.home_directory = user_info.home_directory;

        /**
         * The username for the user.
         * @type {String}
         * @readonly
         */
        this.username = user_info.username;

        /**
         * Whether or not the user is currently logged in.
         * @type {Boolean}
         * @readonly
         */
        this.logged_in = user_info.logged_in;

        /**
         * The last session that the user logged into.
         * @type {String|null}
         * @readonly
         */
        this.session = user_info.session;

        /**
         * DEPRECATED!
         * @deprecated See {@link LightDMUser.username}.
         * @type {String}
         * @readonly
         */
        this.name = user_info.name;

        /**
         * DEPRECATED!
         * @deprecated See {@link LightDMUser.display_name}.
         * @type {String}
         * @readonly
         */
        this.real_name = user_info.real_name;
    }
}


/**
 * Provides various utility methods for use by theme authors. The greeter will automatically
 * create an instance of this class when it starts. The instance can be accessed
 * with the global variable: `greeter_util`.
 * @memberOf LightDM
 */
class GreeterUtil {

    constructor() {
        if (null !== greeter_util) {
            return greeter_util;
        }

        greeter_util = this;
        this._mock_data = MockData();
    }

    /**
     * Returns the contents of directory at `path`.
     *
     * @param path
     * @returns {String[]} List of abs paths for the files and directories found in `path`.
     */
    dirlist(path) {
        return this._mock_data.dirlist;
    }

    /**
     * Escape HTML entities in a string.
     *
     * @param {String} text
     * @returns {String}
     */
    txt2html(text) {
        let entities_map = {
            '"': '&quot;',
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };

        return text.replace(/[\"&<>]/g, a => entities_map[a]);
    }
}


/**
 * Provides theme authors with a way to retrieve values from the greeter's config
 * file located at `/etc/lightdm/lightdm-webkit2-greeter.conf`. The greeter will
 * create an instance of this class when it starts. The instance can be accessed
 * with the global variable: `config`.
 * @memberOf LightDM
 */
class ConfigFile {

    constructor() {
        if (null !== config) {
            return config;
        }

        config = this;
        this._mock_data = MockData();
    }

    /**
     * Returns the value of `key` from the greeter's config file.
     *
     * @arg {String} key
     * @returns {Boolean} Config value for `key`.
     */
    get_bool(key) {
        return (key in this._mock_data.config) ? Boolean(this._mock_data.config[key]) : false;
    }

    /**
     * Returns the value of `key` from the greeter's config file.
     *
     * @arg {String} key
     * @returns {Number} Config value for `key`.
     */
    get_num(key) {
        return (key in this._mock_data.config) ? parseInt(this._mock_data.config[key]) : 0;
    }

    /**
     * Returns the value of `key` from the greeter's config file.
     *
     * @arg {String} key
     * @returns {String} Config value for `key`.
     */
    get_str(key) {
        return (key in this._mock_data.config) ? this._mock_data.config[key] : '';
    }
}


/**
 * @ignore
 */
let MockObjects = {
    LightDMLanguage(obj) {
        return new LightDMLanguage(obj);
    },
    LightDMLayout(obj) {
        return new LightDMLayout(obj);
    },
    LightDMSession(obj) {
        return new LightDMSession(obj);
    },
    LightDMUser(obj) {
        return new LightDMUser(obj);
    }
};



/**
 * Mock data to simulate the greeter's API in any web browser.
 * @ignore
 */
let MockData = () => ({
    greeter: {
        default_values: {
            string: () => '',
            int: () => 0,
            bool: () => false,
            list: () => [],
            'null': () => null
        },
        hostname: 'Mock Greeter',
        properties: {
            string: ['authentication_user', 'autologin_user', 'default_session', 'hostname', 'num_users'],
            int: ['autologin_timeout'],
            bool: [
                'autologin_guest', 'can_hibernate', 'can_restart', 'can_shutdown', 'can_suspend',
                'has_guest_account', 'hide_users', 'in_authentication', 'is_authenticated',
                'lock_hint', 'select_guest_hint', 'select_user_hint'
            ],
            list: ['languages', 'layouts', 'sessions', 'users'],
            'null': ['language', 'layout']
        }
    },
    languages: [{
        name: 'English',
        code: 'en_US.utf8',
        territory: 'USA'
    }, {
        name: 'Catalan',
        code: 'ca_ES.utf8',
        territory: 'Spain'
    }, {
        name: 'French',
        code: 'fr_FR.utf8',
        territory: 'France'
    }],
    layouts: [{
        name: 'us',
        short_description: 'en',
        description: 'English (US)'
    }, {
        name: 'at',
        short_description: 'de',
        description: 'German (Austria)'
    }, {
        name: 'us rus',
        short_description: 'ru',
        description: 'Russian (US, phonetic)'
    }],
    sessions: [{
        key: 'gnome',
        name: 'GNOME',
        comment: 'This session logs you into GNOME'
    }, {
        key: 'cinnamon',
        name: 'Cinnamon',
        comment: 'This session logs you into Cinnamon'
    }, {
        key: 'plasma',
        name: 'Plasma',
        comment: 'Plasma by KDE'
    }, {
        key: 'mate',
        name: 'MATE',
        comment: 'This session logs you into MATE'
    }, {
        key: 'openbox',
        name: 'Openbox',
        comment: 'This session logs you into Openbox'
    }],
    users: [{
        display_name: 'Clark Kent',
        language: null,
        layout: null,
        image: '/usr/share/lightdm-webkit/themes/antergos/img/antergos-logo-user',
        home_directory: '/home/superman',
        username: 'superman',
        logged_in: false,
        session: 'gnome',

        name: 'superman',
        real_name: 'Clark Kent'
    }, {
        display_name: 'Bruce Wayne',
        language: null,
        layout: null,
        image: '/usr/share/lightdm-webkit/themes/antergos/img/antergos-logo-user',
        home_directory: '/home/batman',
        username: 'batman',
        logged_in: false,
        session: 'cinnamon',

        name: 'batman',
        real_name: 'Bruce Wayne'
    }, {
        display_name: 'Peter Parker',
        language: null,
        layout: null,
        image: '/usr/share/lightdm-webkit/themes/antergos/img/antergos-logo-user',
        home_directory: '/home/spiderman',
        username: 'spiderman',
        logged_in: false,
        session: 'MATE',

        name: 'spiderman',
        real_name: 'Peter Parker'
    }]
});


if (!('lightdm' in window)) {
    new ConfigFile();
    new GreeterUtil();
    new LightDMGreeter();
}

// mock lighdm for testing
/*

 lightdm.provide_secret = function (secret) {
 if (typeof lightdm._username == 'undefined' || !lightdm._username) {
 throw "must call start_authentication first"
 }
 _lightdm_mock_check_argument_length(arguments, 1);
 var user = _lightdm_mock_get_user(lightdm.username);

 if (!user && secret == lightdm._username) {
 lightdm.is_authenticated = true;
 lightdm.authentication_user = user;
 } else {
 lightdm.is_authenticated = false;
 lightdm.authentication_user = null;
 lightdm._username = null;
 }
 authentication_complete();
 };

 lightdm.start_authentication = function (username) {
 if ('undefined' === typeof username) {
 show_prompt("Username?", 'text');
 lightdm.awaiting_username = true;
 return;
 }
 _lightdm_mock_check_argument_length(arguments, 1);
 if (lightdm._username) {
 throw "Already authenticating!";
 }
 var user = _lightdm_mock_get_user(username);
 if (!user) {
 show_error(username + " is an invalid user");
 }
 show_prompt("Password: ");
 lightdm._username = username;
 };

 lightdm.cancel_authentication = function () {
 _lightdm_mock_check_argument_length(arguments, 0);
 if (!lightdm._username) {
 console.log("we are not authenticating");
 }
 lightdm._username = null;
 };

 lightdm.suspend = function () {
 alert("System Suspended. Bye Bye");
 document.location.reload(true);
 };

 lightdm.hibernate = function () {
 alert("System Hibernated. Bye Bye");
 document.location.reload(true);
 };

 lightdm.restart = function () {
 alert("System restart. Bye Bye");
 document.location.reload(true);
 };

 lightdm.shutdown = function () {
 alert("System Shutdown. Bye Bye");
 document.location.reload(true);
 };

 lightdm.login = function (user, session) {
 _lightdm_mock_check_argument_length(arguments, 2);
 if (!lightdm.is_authenticated) {
 throw "The system is not authenticated";
 }
 if (user !== lightdm.authentication_user) {
 throw "this user is not authenticated";
 }
 alert("logged in successfully!!");
 document.location.reload(true);
 };
 lightdm.authenticate = function (session) {
 lightdm.login(null, session);
 };
 lightdm.respond = function (response) {
 if (true === lightdm.awaiting_username) {
 lightdm.awaiting_username = false;
 lightdm.start_authentication(response);
 } else {
 lightdm.provide_secret(response);
 }
 };
 lightdm.start_session_sync = function () {
 lightdm.login(null, null);
 };

 if (lightdm.timed_login_delay > 0) {
 setTimeout(function () {
 if (!lightdm._timed_login_cancelled()) {
 timed_login();
 }
 }, lightdm.timed_login_delay);
 }

 var config = {}, greeterutil = {};

 config.get_str = function (section, key) {
 var branding = {
 logo: 'img/antergos.png',
 user_logo: 'ing/antergos-logo-user.png',
 background_images: '/usr/share/antergos/wallpapers'
 };
 if ('branding' === section) {
 return branding[key];
 }
 };
 config.get_bool = function (section, key) {
 return true;
 };


 greeterutil.dirlist = function (directory) {
 if ('/usr/share/antergos/wallpapers' === directory) {
 return ['/usr/share/antergos/wallpapers/83II_by_bo0xVn.jpg', '/usr/share/antergos/wallpapers/antergos-wallpaper.png', '/usr/share/antergos/wallpapers/as_time_goes_by____by_moskanon-d5dgvt8.jpg', '/usr/share/antergos/wallpapers/autumn_hike___plant_details_by_aoiban-d5l7y83.jpg', '/usr/share/antergos/wallpapers/blossom_by_snipes2.jpg', '/usr/share/antergos/wallpapers/c65sk3mshowxrtlljbvh.jpg', '/usr/share/antergos/wallpapers/early_morning_by_kylekc.jpg', '/usr/share/antergos/wallpapers/extinction_by_signcropstealer-d5j4y84.jpg', '/usr/share/antergos/wallpapers/field_by_stevenfields-d59ap2i.jpg', '/usr/share/antergos/wallpapers/Grass_by_masha_darkelf666.jpg', '/usr/share/antergos/wallpapers/Grass_Fullscreen.jpg', '/usr/share/antergos/wallpapers/humble_by_splendidofsun-d5g47hb.jpg', '/usr/share/antergos/wallpapers/In_the_Grass.jpg', '/usr/share/antergos/wallpapers/morning_light.jpg', '/usr/share/antergos/wallpapers/Nautilus_Fullscreen.jpg', '/usr/share/antergos/wallpapers/nikon_d40.jpg', '/usr/share/antergos/wallpapers/sky_full_of_stars.jpg', '/usr/share/antergos/wallpapers/solely_by_stevenfields.jpg', '/usr/share/antergos/wallpapers/the_world_inside_my_lens__by_moskanon-d5fsiqs.jpg', '/usr/share/antergos/wallpapers/white_line_by_snipes2.jpg']
 }
 }
 }

 function _lightdm_mock_check_argument_length(args, length) {
 if (args.length != length) {
 throw "incorrect number of arguments in function call";
 }
 }

 function _lightdm_mock_get_user(username) {
 var user = null;
 for (var i = 0; i < lightdm.users.length; ++i) {
 if (lightdm.users[i].name == username) {
 user = lightdm.users[i];
 break;
 }
 }
 return user;
 }
 */
