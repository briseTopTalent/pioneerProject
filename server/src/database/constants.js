const LocalityColumns = [
  'id',
  'name',
  'state',
  'latitude',
  'longitude',
  'subscriber_only_comments',
  'twitter_page_name',
  'news_rss_feed_url',
];
const UserColumns = [
'id',
'email',
'first_name',
'last_name',
'phone_number',
'role',
'verified',
'confirmation_sent',
'flagged',
'feed_type',
'title',
'subscription',
'last_login',
];
const RestrictedUserColumns = [
'id',
'email',
'first_name',
'last_name',
'role',
'verified',
'feed_type',
'title',
'subscription',
'last_login',
];

const NonAdminLocalityColumns = [
  'id',
  'name',
  'state',
  'latitude',
  'longitude',
  'subscriber_only_comments',
  'news_rss_feed_url',
];

module.exports = {
  LocalityColumns,
  NonAdminLocalityColumns,
  UserColumns,
  RestrictedUserColumns,
};
