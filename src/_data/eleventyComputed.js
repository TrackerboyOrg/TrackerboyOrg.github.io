
module.exports = {
  // Provides an array accessor to the releasesByTag key, sorted by the latest
  // tag. Allows us to customize the order of the releases, as well as making
  // it easier for templates to display this data.
  releases: data => Object.values(data.releasesByTag).sort().reverse()
}
