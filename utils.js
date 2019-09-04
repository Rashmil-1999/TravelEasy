module.exports.getPassword = async function(knex, email_id) {
  let data_res = await knex
    .withSchema("tours")
    .select("fname", "password")
    .from("users")
    .where({ email_id: email_id })
    .then(row => row[0])
    .catch(err => {
      console.log(err);
      throw err;
    });
  if (data_res === undefined) {
    return false;
  }
  return data_res;
};
