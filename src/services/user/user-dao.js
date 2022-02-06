class UserDao {
  constructor(logger) {
    this.log = logger;
    this.log.info('An instance of UserDao was created');
  }

  getAll() {
    this.log.warn('method has not been created for this class');
  }

  find() {
    this.log.warn('method has not been created for this class');
  }

  update() {
    this.log.warn('method has not been created for this class');
  }

  delete() {
    this.log.warn('method has not been created for this class');
  }

  create() {
    this.log.warn('method has not been created for this class');
  }
}

module.exports = UserDao;
