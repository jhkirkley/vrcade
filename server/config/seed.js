/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
var Product = require('../api/product/product.model');
var Catalog = require('../api/catalog/catalog.model');
var mainCatalog, art, games, science, fashion;
import Channel from '../api/channel/channel.model';

Thing.find({}).removeAsync()
  .then(() => {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
             'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
             'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
             'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
             'tests alongside code. Automatic injection of scripts and ' +
             'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
             'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
             'payload, minifies your scripts/css/images, and rewrites asset ' +
             'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
             'and openshift subgenerators'
    });
  });

User.find({}).removeAsync()
  .then(() => {
    User.createAsync({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
     .then(() => {
      console.log('finished populating users');
      return User.find();
    })
    .then((users) => {
      return createChannels(users);
    })
    .then((channels) => {
      console.log('created the following channels:\n', channels);
    }, handleError);
  });

  function createChannels(users) {
  return Channel.find().remove({})
  .then(() => {
    let now = new Date();
    return Channel.create([
      {
        name: 'Classroom',
        description: 'Classroom discussion',
        active: true,
        owner: users[0]._id,
        messages: [
          { text: 'First message.',  createdAt: now, user: users[0]._id },
          { text: 'Second message.', createdAt: now, user: users[1]._id }
        ]
      },
      {
        name: 'Outcomes',
        description: 'I Need a job!',
        active: true,
        owner: users[0]._id,
        messages: [
          { text: 'Third message.',  createdAt: now, user: users[0]._id },
          { text: 'Fourth message.', createdAt: now, user: users[1]._id }
        ]
      },
      {
        name: 'Resources',
        description: 'Where can I get more info?',
        active: true,
        owner: users[1]._id,
        messages: [
          { text: 'Fifth message.', createdAt: now, user: users[0]._id },
          { text: 'Sixth message.', createdAt: now, user: users[1]._id }
        ]
      }
    ]);
  }, handleError);
}

function handleError(err) {
  console.log('ERROR', err);
}
Catalog
  .find({})
  .remove()
  .then(function () {
    return Catalog.create({ name: 'All'});
  })
  .then(function (catalog) {
    return Catalog.create({ name: 'Art'});
  })
  .then(function (category) {
    return Catalog.create({ name: 'Games'});
  })
  .then(function (category) {
    return Catalog.create({ name: 'Fashion'});
  })
  .then(function (category) {
    return Product.find({}).remove({});
  })
  .then(function() {
    return Product.create({
      title: 'Jayne Mansfield',
      imageUrl: '/assets/uploads/jmansfield2.png',
      price: 25,
      description: 'Jayne Mansfield was an American actress in film, theatre, and television. She was also a nightclub entertainer, a singer, and one of the early Playboy Playmates'
    }, {
      title: 'Rita Hayworth',
      price: 15,
      description: 'Rita Hayworth was an American actress and dancer'
    }, {
      title: 'Marilyn',
      imageUrl: '/assets/uploads/mm.jpg',
      price: 8,
      description: 'Marilyn Monroe was an American actress and model'
    }, {
      title: 'Zoe',
      imageUrl: '/assets/uploads/zoe.jpeg',
      price: 8,
      description: 'Zoe Saldana-Perego, Zoe Saldana, is an American actress and dancer. Following her performances with the FACES theater group, Saldana made her screen debut in an episode of Law & Order.'
    });
  })
   .then(function () {
    console.log('Finished populating Products with categories');
  })
  .then(null, function (err) {
    console.error('Error populating Products & categories: ', err);
  });


