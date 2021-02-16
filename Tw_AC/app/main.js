

const filterTerm = location.search.replace("?s=", "");


window.addEventListener('load', () => {
    renderMainNavigation();
    renderTweetMessages();
    initFormEvent();
    resetTimeLine();
    initModalTweetEvent();
    trendingTopic();
});








/**
 * 
 * 
 * HEADER
 * 
 * 
 * Pintado del Main Navigation (aside izquierdo)
 */


const renderMainNavigation = () => {

    // Global Vars
    let mainNavigationHTML = document.querySelector('.main_navigation_items');
    let mainNavigationStrings = "";

    // Methods
    dataTwitter.mainNavigationItems.forEach(items => {
        mainNavigationStrings += `
        <div class="main_navigation_item">
            <span class="fa fa-${items.icon}"></span>
            ${items.name}
        </div>
        `;
    });

    mainNavigationHTML.innerHTML = mainNavigationStrings;

    initHeaderEvents();
};








/**
 * Inicialización de eventos del menú de usuario situado en el aside izquierdo
 */


const initHeaderEvents = () => {

    // Global Vars
    let userToggle = document.querySelector('.user .user_option');
    let userSubMenu = document.querySelector('.user .user_submenu');
    let submenuOpened = false;

    // Methods
    let openUserSubMenu = () => {
        userSubMenu.classList.add('active');
        userToggle.classList.add('active');
        submenuOpened = true;
    };

    let closeUserSubMenu = () => {
        userSubMenu.classList.remove('active');
        userToggle.classList.remove('active');
        submenuOpened = false;
    };

    // Events
    userToggle.addEventListener('click', () => {
        if (!submenuOpened) {
            openUserSubMenu();
        } else {
            closeUserSubMenu();
        }
    });
};








/**
 * 
 * 
 * FORMULARIO
 * 
 * 
 * Pintado de datos e inicialización de sus eventos
 */




/**
 * Eventos de los formularios de todo el proyecto
 */


const initForms = (form, callback = () => {}) => {
    let textArea = form.elements.main_form_textarea;

    form.addEventListener('submit', (ev) => {
        // Prevenimos que el programa se envíe    
        ev.preventDefault();

    
        // Capturamos información del textarea y lo introducimos en el array de la variable global
        // además de prevenir que si el TextArea está vacío no se haga ningún push al array
        if (textArea.value != "") {

            dataTwitter.tweets.unshift({
                name: 'Andrea',
                account: '@Andreahola',
                picture: 'https://randomuser.me/api/portraits/women/44.jpg',
                text: textArea.value,
                comments: 0,
                rts: 0,
                likes: 0,
                dateCreation: 'Tweet escrito a las ' + new Date().getHours() + ' hrs'
            });
        };
        
        
        renderTweetMessages();
        form.reset();
        

        // Función que se ejecutará al final de mi dunción pasándola como parámetro
        callback();
    });
};




/**
 * Eventos del formulario del Main Twitter
 */


const initFormEvent = () => {

    // Global Vars
    let form = document.forms.main_form;
    let textArea = form.elements.main_form_textarea;
    let formButton = document.querySelector('.main_form button');


    // Indicador de haber sobrepasado de los 150 caracteres admitidos
    textArea.addEventListener('keyup', () => {
        if (textArea.value.length > 150) {
            textArea.classList.add('disable');
            formButton.classList.add('disable');
        } else {
            textArea.classList.remove('disable');
            formButton.classList.remove('disable');
        }
    });


    // Llamamos a la función de inicializar los eventos de este formulario concreto con el parámetro declarado
    initForms(form);
};




/**
 * Pintado de los valores extraidos del formulario
 */

const renderTweetMessages = () => {   
    let tweetContent = document.querySelector('.tweet_feed');
    let tweetHTML = "";

    dataTwitter.tweets.filter(tweets => tweets.text.includes(filterTerm))
        .forEach(tweet => {
            tweetHTML += `
                <div class="tweet">
                    <div class="tweet_user_picture">
                        <img src="${tweet.picture}" alt="Foto de perfil">
                    </div>

                    <div class="tweet_info">
                        <div class="user_name">${tweet.name}</div>
                        <div class="user_account">${tweet.account}</div>
                        <span class="fa fa-circle"></span>
                        <div class="tweet_time">${tweet.dateCreation}</div>

                        <div class="edit_tweet"><span class="fa fa-ellipsis-h"></span></div>
                    </div>
                    
                    <div class="tweet_content">${tweet.text}</div>

                    <div class="tweet_icons">

                        <div class="icon">
                            <span class="fa fa-comment-o"></span>
                            <div class="hmtimes_comment">${tweet.comments}</div>
                        </div>

                        <div class="icon">
                            <span class="fa fa-retweet"></span>
                            <div class="hmtimes_rt">${tweet.rts}</div>
                        </div>

                        <div class="icon">
                            <span class="fa fa-heart"></span>
                            <div class="hmtimes_like">${tweet.likes}</div>
                        </div>

                        <div class="delete_tweet"><span class="fa fa-trash"></span></div>
                    </div>
                </div>
            `;
        });
    
    tweetContent.innerHTML = tweetHTML;

    initTweetsEvents();
    renderTweetsAmount();
    trendingTopic();
};




/**
 * Eventos de los propios tweets
 */

const initTweetsEvents = () => {

    let tweetsDOM = document.querySelectorAll('.tweet_feed .tweet');

    tweetsDOM.forEach((tweet, i) => {

        // Global Vars
        let trashToggle = tweet.querySelector('.fa-trash');

        let likeToggle = tweet.querySelector('.fa-heart');
        let likeNumber = tweet.querySelector('.hmtimes_like');

        let rtToggle = tweet.querySelector('.fa-retweet');
        let rtNumber = tweet.querySelector('.hmtimes_rt');


        // Events

        /**
         * ELIMINAR
         */

        trashToggle.addEventListener('click', () => {
            dataTwitter.tweets.splice(i, 1);

            // Volvemos a pintar todos los elementos
            renderTweetMessages();
        })


        /**
         * LIKE
         */

        likeToggle.addEventListener('click', () => {
            dataTwitter.tweets[i].likes++;

            // Volvemos a pintar todos los elementos
            renderTweetMessages();
        });

        if(dataTwitter.tweets[i].likes >= 1) {
            likeToggle.classList.add('likes_active');
            likeNumber.classList.add('likes_number_active');
        };


        /**
         * RT
         */

        rtToggle.addEventListener('click', () => {
            dataTwitter.tweets[i].rts++;

            // Volvemos a pintar todos los elementos
            renderTweetMessages();
        });

        if(dataTwitter.tweets[i].rts >= 1) {
            rtToggle.classList.add('rt_active');
            rtNumber.classList.add('rt_number_active');
        };
    });
};








/**
 * 
 * 
 * ASIDE TRENDS
 * 
 * 
 * Contador de tweets
 * 
 */


const renderTweetsAmount = () => {

    // Global Vars
    let amount = dataTwitter.tweets.length;
    let amountDOM = document.querySelector('.total_amount');
    

    // Vars that transform params
    let messageAmount = `${amount} tweets`;

    amountDOM.innerHTML = messageAmount;
};




/**
 * Reseteador del timeline de tweets pintados en el Main
 */


const resetTimeLine = () => {
    
    // Global Vars
    let resetButton = document.querySelector('.reset_tweets button');


    resetButton.addEventListener('click', () => {
        dataTwitter.tweets.splice(0);

        renderTweetMessages();
        trendingTopic();
    })
};




/**
 * Trending Topic
 */

const trendingTopic = () => {

    // Global Vars
    let popularWords = [];
    let deleteWords = [];
    let repetedWords = [];


    // Methods


    /** 1 - Recorro .text del JSON de tweets y los meto en un nuevo array */


    dataTwitter.tweets.forEach(words => {
        popularWords.push(words.text);
    });

    // lo convierto en un string...
    let popularWordsString = popularWords.join(", ");
    
    // ... para poder hacer un array con las palabras separadas
    let popularWordsNewArray = popularWordsString.split(" ");
    // console.log(popularWordsNewArray);   




    /** 2 - Encuentro las similitudes entre el contenido del nuevo array */


    popularWordsNewArray.forEach(words => {
        if (popularWordsNewArray.filter(word => word == words).length > 1) {
            repetedWords.push(words);
        }
    });




    /** 3 - Meto las palabras repetidas en un nuevo array que las reduzca a una */


    repetedWords.forEach(word => {
        let wordCheck = deleteWords.includes(word);

        if (!wordCheck) {
            deleteWords.push(word);
        }
    });

    let coma = deleteWords.indexOf(",")
    deleteWords.splice(coma, 1);




    /** 4 - Pinto las palabras repetidas en el DOM */

    let trendingTopic = document.querySelector('.trending_topic');
    
    trendingTopic.innerHTML = deleteWords;
};








/**
 * 
 * 
 * MODAL TWEET
 * 
 * 
 */



/**
 * Inicializamos los eventos del formulario del Modal Tweet para que se pinten en el Main del Twitter
 */


const initModalFormEvent = () => {

    // Global Vars
    let form = document.forms.modal_form;
 
    
    // Methods
    initForms(form, () => {
        closeModalTweet();
    });
    renderTweetMessages();
    form.reset();
};




/**
 * Inicializamos los eventos del Popup del Modal Tweet
 */


const initModalTweetEvent = () => {

    // Global Vars
    let toggleOpenModalTweet = document.querySelector('.main_navigation .button_icon');
    let toggleCloseModalTweet = document.querySelector('.modal_header .close_button');
    let overlay = document.querySelector('.modal_overlay');


    // Events
    toggleOpenModalTweet.addEventListener('click', () => {
        openModalTweet()
    });

    toggleCloseModalTweet.addEventListener('click', () => {
        closeModalTweet()
    });

    overlay.addEventListener('click', () => {
        closeModalTweet()
    });

    initModalFormEvent();
};




/**
 * Método para abrir el Popup Modal Tweet
 */


const openModalTweet = () => {

    // Global Vars
    let modalTweet = document.querySelector('.modal_tweet');


    // Methods
    modalTweet.classList.add('opened');
    document.body.style.overflow = 'hidden';
};




/**
 * Método para cerrar el Popup Modal Tweet
 */


const closeModalTweet = () => {

    // Global Vars
    let modalTweet = document.querySelector('.modal_tweet');


    //Methods
    modalTweet.classList.remove('opened');
    document.body.style.overflow = '';
};