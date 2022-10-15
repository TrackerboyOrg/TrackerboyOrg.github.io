#!/usr/bin/env python3

# Continuous integration script for adding a page to the downloads collection
#
# Examples:
# ./ci.py develop path-to-generated-docs
# ./ci.py release path-to-denerated-docs release-tag path-to-changelog


import argparse, os, sys, shutil
from enum import Enum

SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))
DOWNLOADS_PATH = os.path.join(SCRIPT_PATH, '_downloads')
del SCRIPT_PATH

def downloadsPageOf(tag):
    return os.path.join(DOWNLOADS_PATH, f'{tag}.md')


def findTagInChangelog(f, tag):
    version = tag[1:]
    while line := f.readline():
        tokens = line.split()
        # 4 tokens: "##", "[version]", "-", "date"
        if len(tokens) == 4 and \
           tokens[0] == "##" and \
           tokens[1][1:-1] == version and \
           tokens[2] == "-":
           return tokens[3]
    return None

class Assets(object):

    class AssetKind(Enum):
        linux64 = 0
        osx64 = 1
        win32 = 2
        win64 = 3
        manual = 4
        other = 5

    def __init__(self):
        self.__assets = [None for _ in range(Assets.AssetKind.other.value)]

    def __len__(self):
        count = len(self.__assets) - Assets.AssetKind.other.value
        for i in range(Assets.AssetKind.other.value):
            if self.__assets[i] != None:
                count += 1
        return count

    def __str__(self):
        if len(self) == 0:
            return ""
        else:
            lines = ['assets:']
            for asset in self.__assets:
                if asset != None:
                    lines.append(f' - name: {asset[0]}')
                    lines.append(f'   {asset[1]}: {asset[2]}')
            return '\n'.join(lines)

    def __add(self, name, field, val):
        self.__assets.append( (name, field, val) )

    def set(self, kind, sourceKind, source):
        asset = (kind, sourceKind, source)
        try:
            kindEnum = Assets.AssetKind[kind]
            if kindEnum != Assets.AssetKind.other:
                self.__assets[kindEnum.value] = asset
                return
        except KeyError:
            pass
        
        self.__assets.append(asset)


    def setMultiple(self, kind, assets):
        if assets != None:
            for asset in assets:
                self.set(asset[0], kind, asset[1])
        


def release(args):
    with open(args.changelog, 'r') as changelogFile:
        date = findTagInChangelog(changelogFile, args.tag)
        if date is None:
            print("error: could not find", args.tag, "in", args.changelog)
            return 1
        
        with open(downloadsPageOf(args.tag), 'w') as releaseFile:

            assets = Assets()
            assets.setMultiple('github-asset', args.github_asset)
            assets.setMultiple('url', args.url_asset)

            releaseFile.write(f'''---
layout: release
title: {args.tag}
date: {date}
{assets}
---
''')
            while line := changelogFile.readline():
                tokens = line.split(maxsplit=1)
                if len(tokens) == 2 and tokens[0] == "##":
                    break
                releaseFile.write(line)
    return 0

def remove(args):
    shutil.rmtree(docsPathOf(args.tag), ignore_errors=True)
    releasePage = downloadsPageOf(args.tag)
    if os.path.exists(releasePage):
        os.remove(releasePage)
    return 0


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    subs = parser.add_subparsers(required=True, help='sub-command help')

    releaseParser = subs.add_parser('release', help="Add a new release")
    releaseParser.add_argument('tag', help='Release tag to add')
    releaseParser.add_argument('changelog', help='Path to CHANGELOG.md')
    releaseParser.add_argument('--github-asset', nargs=2, action='append', help='Specify a github asset')
    releaseParser.add_argument('--url-asset', nargs=2, action='append', help='Specify a url asset')
    
    releaseParser.set_defaults(subcmd=release)

    removeParser = subs.add_parser('remove', help='Removes a previously added release')
    removeParser.add_argument('tag', help='Release tag to remove')
    removeParser.set_defaults(subcmd=remove)

    args = parser.parse_args()
    sys.exit(args.subcmd(args))
