# Introduction

Thanks for considering contributing to Kee. It's people like you that help Kee to continually improve.

Kee is an open source project and we love to receive contributions from our community — you! There are many ways to contribute, from writing tutorials or blog posts, improving the documentation, translating Kee into more languages, submitting bug reports and feature requests or writing code which can be incorporated into the next version of Kee.

# Ground Rules

Please note that this project is released with a [Contributor Code of Conduct](https://github.com/kee-org/browser-addon/blob/master/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

Ensure you have read and understood the [guidelines on the community forum](https://forum.kee.pm/t/contributions-bugs-help-and-support-guidelines/548) which advise where particular types of contribution should be directed.

In particular, if you are considering searching or asking for help about any of the following you should go to the [forum](https://forum.kee.pm).

* Help using Kee
* Documentation
* Bug reports
* Change proposals
* Feature requests
* Questions/comments about security(*)
* Help developing/building Kee

# Translating

Most of Kee can be translated into any language. If you want to help users to understand Kee it would be great if you could translate the English version into your own language. Several languages are already complete but there are hundreds still awaiting translation so please take a look.

The best way for you to get started is to log in (or click the link to sign up) here: https://www.transifex.com/signin/

Once you're logged in to Transifex you should see an option to join the team for your language in the Kee project: https://www.transifex.com/projects/p/keefox/

# Testing

Kee is primarilly an integration product - it's value, and the outcomes one wants to test, come from the combination of mutliple products. The best value tests are therefore those which excersise this entire user experience. Currently this is done manually before a release by working through the Kee tutorial and exploring a random selection of websites looking for unusual behaviour.

There would be a benefit from the development of some automated testing in this area (utilising something like Selenium perhaps) and also probably some more focussed unit testing around areas relating to data transfer with KeePassRPC and maybe logic around form detection (taking inputs such as a mock DOM, JSON config and list of matched entries).

None of this work is currently planned so if this is an area that interests you, please get involved to help keep the quality of Kee improving.

# Development

## Rules

To ensure your work can quickly be released to improve Kee for many users, please follow these rules:

* Base your development off the master branch
* Rebase onto master periodically and especially during the Pull Request review procedure
* Do not change any localisation files except for the source (English). `_locales/en/messages.json` should be changed as needed, but no other files in the `_locales` folder. Ensure you understand the rules of the [stabilisation period](#stabilisation-period)
* Follow the style configuration in the `.editorconfig` file. Most modern editors will automatically do this for you. Some, but not all, of this configuration can be enforced by tslint at build time.
* Read the information about branches below before creating a Pull Request
* Create separate PRs for unrelated changes
* Look at the result of the TravisCI build which will run after you create the PR and address any errors that cause the check to fail.

## Branches

### Master branch

* Kee utilises a Continuous Integration process on the `master` branch.
* This branch is "close" to release-ready but at any given commit, manual testing and translation work has usually not been completed.
* Features merged into this branch that contain text strings will be made available for immediate translation on Transifex
* If a `release/n.m` branch exists but no stable n.m release has been pushed to users the master branch is undergoing stabilisation so some [more restrictive rules apply](#stabilisation-period).

### Feature branches

* Development work should be performed on feature branches (often in a forked repo)
* Create a Pull Request for master when the feature is complete and locally tested
* Example: `feature/add-fancy-improvement`

### Release branches

* When a set of release notes for the next release is added to master, we create a release branch at the commit that contains those release notes
* The latest translations are pulled from Transifex and added to the release branch and master
* In the normal case, a beta release and then a stable release will be distributed to users
* See the [Release process](https://forum.kee.pm/t/versioning-and-releases/550#heading--release-process) for more information on how these branches are used
* Example: `release/2.1`

## Stabilisation period

* For around 10-21 days between the addition of a set of release notes for the next release and the stable release to all users, we enter a stabilisation period.
* This allows for critical bugs found during beta testing to be fixed and time for translators to fully localise the strings that have changed or been added for this version.
* To avoid pausing integration for this period, we create a release branch as described above and allow continued development on the master branch.
* **Existing strings MUST NOT be changed or deleted during this period**. This prevents accidental premature release of modified strings. Transifex does not support branching of translation effort so all git (code) branches that may receive translation work must be fully compatible; this rule ensures this is the case.
    * PRs that need to change existing strings must wait until after the next version of Kee has been released.
   * Often one can create new strings (and later delete the old ones after the stabilisation period has ended) in order to entirely side-step this limitation.

## Build instructions

See the build instructions in the [README](https://github.com/kee-org/browser-addon/blob/master/README.md).

## New to development?

Working on your first Pull Request? You can learn how from this *free* series, [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

# GitHub issues

GitHub issues are for clear and well defined changes to project behaviour, appearance and code. This allows Kee developers to keep track of planned feature development, bug fixes and other tasks.

Issues may not always be worked on immediately but if there is not a clear plan and need for a change, the issue may be closed, at least until the need or specification is more clearly evaluated on the community forum.

Each issue can have one or more labels attached. "**enhancement**", "**bug**" and "**task**" should be self-explanatory; others are explained in sections below.

## Closed issues

A closed issue with no label other than the three mentioned above is considered "finished" - it has been implemented, tested and released (or will be released with the next version of Kee). That doesn't mean there are no bugs but normally we'd create a new issue for a bug associated with a "finished" issue.

Other reasons for an issue to be closed are:

"**invalid**" - This could mean many things. E.g. it's not a real bug or enhancement request, there is not enough information to define the issue well enough to act upon it, other changes have made it obsolete, etc.

"**wontfix**" - For some reason (usually explained in the issue comments) we've decided to not implement the change requested in this issue. Such a state is not a permanent ban on the enhancement or bug fix but it's a good indication that we don't feel that our limited development time should be spent on this particular issue in the foreseeable future.

"**duplicate**" - The underlying request or problem is already covered by an existing issue.

## Open issues

An open issue is one that we have not yet had time to implement. For new issues it's possible that we've just not yet had time to assess the issue and make a decision about how to procede.

You can see what each developer is working on by looking at the issues that are assigned to them. Depending on the scope of the issue, a developer may be working on it for hours, days or even months.

Open issues may be "**blocked**" which indicates that we are unable to proceed with the issue. The reason will usually be described in a comment. A common reason would be when we are depenendant upon a change being made to other software (e.g. Firefox).

### Milestones

Each open issue may have a milestone attached to it. These give an indication (but by no means a guarantee) of when we expect a particular issue to be finished.

If there is no milestone this implies that either:

1. the issue is clear and well understood but we have not decided when it will be implemented
2. we may implement the feature one day but a major concern is keeping us from committing to it at the moment (e.g. unclear security or privacy implications, limitations of current technology, size of task makes it unlikely we could find time to implement it, etc.)

Issues that remain in the 2nd state for any significant length of time are likely to be closed as invalid or wontfix.

Note that in contrast to the KeeFox project, we prefer lengthy discussion and "wouldn't it be nice if..." ideas to remain on the community forum until there is a reasonable chance that someone will be able to work on the issue. There will always be grey areas though so don't read into the presense of a GitHub issue too rigidly.
