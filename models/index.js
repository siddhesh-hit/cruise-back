const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const UserCredential = sequelize.define(
  "userCredential",
  {
    cred_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone_number: {
      type: Sequelize.STRING,
      unique: true,
    },
    oauth_provider: {
      type: Sequelize.STRING,
    },
    oauth_token: {
      type: Sequelize.STRING,
    },
    followers: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
    following: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
  },
  {
    timestamps: false,
  }
);

const UserDetail = sequelize.define(
  "userDetail",
  {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: Sequelize.DATE,
    },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    photo: {
      type: Sequelize.STRING,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

const Vehicle = sequelize.define(
  "vehicle",
  {
    vehicle_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehicle_type: {
      type: Sequelize.STRING,
    },
    vehicle_model: {
      type: Sequelize.STRING,
    },
    vehicle_document: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const EventDetail = sequelize.define(
  "eventDetail",
  {
    event_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_name: {
      type: Sequelize.STRING,
    },
    event_start_date: {
      type: Sequelize.DATE,
    },
    event_end_date: {
      type: Sequelize.DATE,
    },
    event_createdBy: {
      type: Sequelize.INTEGER,
    },
    event_time: {
      type: Sequelize.TIME,
    },
    event_details: {
      type: Sequelize.STRING,
    },
    event_dest: {
      type: Sequelize.STRING,
    },
    event_start: {
      type: Sequelize.STRING,
    },
    event_photo: {
      type: Sequelize.STRING,
    },
    event_status: {
      type: Sequelize.STRING,
    },
    event_rendezvous_points: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    event_participants: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
    event_requests: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
  },
  {
    timestamps: false,
    // hooks: {
    //   afterCreate: async (event, options) => {
    //     if (event.event_status === "ongoing") {
    //       const participants = event.event_participants;
    //       const event_id = event.event_id;

    //       for (const cred_id of participants) {
    //         const mapData = await MapUserEvent.create({
    //           cred_id,
    //           event_id,
    //           current_position: [],
    //           dest_distance: 0,
    //           dest_time: 0,
    //           dest_arrival: 0,
    //           alternative_route: [],
    //           leader: false,
    //         });
    //         console.log(
    //           `Map model created for user ${user_id} and event ${event_id}`
    //         );
    //       }
    //     }
    //   },
    // },
  }
);

const UserPost = sequelize.define(
  "userPost",
  {
    post_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    post_title: {
      type: Sequelize.STRING,
    },
    post_description: {
      type: Sequelize.STRING,
    },
    post_likes: {
      type: Sequelize.INTEGER,
      default: 0,
    },
    post_comments: {
      type: Sequelize.INTEGER,
      default: 0,
    },
    post_photo: {
      type: Sequelize.STRING,
    },
    post_location: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const MapUserEvent = sequelize.define(
  "mapUserEvent",
  {
    map_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    current_position: {
      type: Sequelize.GEOMETRY("POINT"),
      allowNull: true,
    },
    dest_distance: {
      type: Sequelize.STRING,
      defaultValue: 0,
    },
    dest_time: {
      type: Sequelize.TIME,
    },
    dest_arrival: {
      type: Sequelize.TIME,
    },
    alternative_route: {
      type: Sequelize.GEOMETRY("LINESTRING"),
    },
    leader: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

const KYCDetail = sequelize.define(
  "kycDetail",
  {
    kyc_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kyc_type: {
      type: Sequelize.STRING,
    },
    kyc_document: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

UserDetail.belongsTo(UserCredential, { foreignKey: "cred_id" });
UserCredential.hasMany(UserDetail, { foreignKey: "cred_id" });

EventDetail.belongsTo(UserCredential, { foreignKey: "cred_id" });
UserCredential.hasMany(EventDetail, { foreignKey: "cred_id" });

Vehicle.belongsTo(UserCredential, { foreignKey: "cred_id" });
UserCredential.hasMany(Vehicle, { foreignKey: "cred_id" });

UserPost.belongsTo(UserCredential, { foreignKey: "cred_id" });
UserCredential.hasMany(UserPost, { foreignKey: "cred_id" });

MapUserEvent.belongsTo(UserCredential, { foreignKey: "cred_id" });
UserCredential.hasMany(MapUserEvent, { foreignKey: "cred_id" });

MapUserEvent.belongsTo(EventDetail, { foreignKey: "event_id" });
EventDetail.hasMany(MapUserEvent, { foreignKey: "event_id" });

KYCDetail.belongsTo(UserCredential, { foreignKey: "cred_id" });
UserCredential.hasMany(KYCDetail, { foreignKey: "cred_id" });

module.exports = {
  sequelize,
  db,
  UserCredential,
  UserDetail,
  Vehicle,
  EventDetail,
  UserPost,
  MapUserEvent,
  KYCDetail,
};
