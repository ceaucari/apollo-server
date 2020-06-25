import bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
    role: {
      type: DataTypes.STRING,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async (login) => {
    let usr = await User.findOne({
      where: { username: login },
    });

    if (!usr) {
      usr = await User.findOne({
        where: { email: login },
      });
    }

    return usr;
  };

  User.beforeCreate(async (usr) => {
    // eslint-disable-next-line no-param-reassign
    usr.password = await usr.generatePasswordHash();
  });

  User.prototype.generatePasswordHash = async function genHash() {
    const saltRounds = 10;
    const hash = await bcrypt.hash(this.password, saltRounds);
    return hash;
  };

  User.prototype.validatePassword = async function validate(password) {
    const pw = await bcrypt.compare(password, this.password);
    return pw;
  };

  return User;
};

export default user;
