import models from '../models';

const createUsersWithMessages = async (date) => {
  await models.User.create(
    {
      username: 'ccastillo',
      email: 'ccastillo@test.com',
      password: '12345678',
      role: 'ADMIN',
      createdAt: date.setSeconds(date.getSeconds() + 1),
      messages: [
        {
          text: 'This is a message from Admin',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    }
  );

  await models.User.create(
    {
      username: 'jdoe',
      email: 'jdoe@test.com',
      password: '12345678',
      role: 'USER',
      createdAt: date.setSeconds(date.getSeconds() + 1),
      messages: [
        {
          text: 'Message 1...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: 'Message 2...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
};

export default createUsersWithMessages;
