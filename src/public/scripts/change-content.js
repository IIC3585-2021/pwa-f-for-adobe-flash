const firebaseConfig = {
    apiKey: "AIzaSyCdF7ItlIDSTLmoiyNL-e-WtlU_SYHizGQ",
    authDomain: "test-feli.firebaseapp.com",
    projectId: "test-feli",
    storageBucket: "test-feli.appspot.com",
    messagingSenderId: "891051472774",
    appId: "1:891051472774:web:dbe65b09045ac3be0a5e07",
    measurementId: "G-LNZ2MJVQJS"
};

const cafeList = document.querySelector('#chat-list')

function renderDiv(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.id;

    li.appendChild(name);

    cafeList.appendChild(li);

    name.addEventListener('click', (e)=>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('message').get().then((snapshot)=>{
            let ul = document.createElement('ul');
            li.appendChild(ul)
            snapshot.docs.forEach(doc1 =>{
                if (doc1.data().chatId === id) {
                    let li_c = document.createElement('li');
                    let content = document.createElement('span');
                    li_c.setAttribute('data-id', doc1.id);
                    content.textContent = doc1.data().content;
                    li_c.appendChild(content);
                    ul.appendChild(li_c);
                }

            });
        })
    })
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.settings({timestampsInSnapshots: true});

// getting data
db.collection('chat').get().then((snapshot)=>{
    snapshot.docs.forEach(doc =>{
        renderDiv(doc)
    });
})

