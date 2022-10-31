#!/usr/bin/env python3

# Continuous integration script for adding a page to the downloads collection
#
# Examples:
# ./ci.py develop path-to-generated-docs
# ./ci.py release path-to-denerated-docs release-tag path-to-changelog

assert __name__ == "__main__", "script cannot be imported"

import argparse, os, sys
from ci_utils import *

def getStorePath() -> str:
    return os.path.join(
        os.path.dirname(os.path.realpath(__file__)), 
        'src/_data/releasesByTag'
    )

def release(store: ReleaseStore, args) -> int:
    releaseToAdd = extractReleaseFromChangelog(args.changelog, args.tag)
    if releaseToAdd is None:
        print("error: could not find", args.tag, "in", args.changelog)
        return 1
    assets = AssetList()
    for method, args in (('github-asset', args.github_asset), ('url', args.url_asset)):
        for name, param in args:
            assets.put(Asset(name, method, param))

    extras = assets.jsonify()
    extras["published"] = True
    store.add(releaseToAdd, **extras)
    return 0

def remove(store: ReleaseStore, args) -> int:
    store.remove(args.tag)
    return 0

def init(store: ReleaseStore, args) -> int:
    for release in extractAllFromChangelog(args.changelog):
        store.add(release, published=False)
    return 0


def main() -> None:
    parser = argparse.ArgumentParser()
    subs = parser.add_subparsers(required=True, help='sub-command help')

    releaseParser = subs.add_parser('release', help="Add a new release")
    releaseParser.add_argument('tag', help='Release tag to add')
    releaseParser.add_argument('changelog', help='Path to CHANGELOG.md')
    releaseParser.add_argument('--github-asset', nargs=2, action='append', help='Specify a github asset', default=[])
    releaseParser.add_argument('--url-asset', nargs=2, action='append', help='Specify a url asset', default=[])
    
    releaseParser.set_defaults(subcmd=release)

    removeParser = subs.add_parser('remove', help='Removes a previously added release')
    removeParser.add_argument('tag', help='Release tag to remove')
    removeParser.set_defaults(subcmd=remove)

    initParser = subs.add_parser('init', help='Initializes the releases store')
    initParser.add_argument('changelog', help='Path to CHANGELOG.md')
    initParser.set_defaults(subcmd=init)

    args = parser.parse_args()
    store = ReleaseStore(getStorePath())
    sys.exit(args.subcmd(store, args))

main()
