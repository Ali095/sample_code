## Summary

The purpose of the test is to reproduce one small feature: __call forwarding__.

Here is the story:

Your company has one main number. This number is an [IVR](https://en.wikipedia.org/wiki/Interactive_voice_response):
- If the caller presses `1`, call is forwarded to another phone number;
- If the caller presses `2`, he is able to leave a voicemail.

It's 9AM in the office and first calls are coming in!


### Use case

The use case we want to reproduce is the following:

- A customer is calling the main number of your company;
- If the caller presses `1`, the call is redirected on your personal phone\*. You should be able to pickup and talk with the caller.
- If the caller presses `2`, he can drop a voicemail (you would like to hear this message later);
- The call has to be logged in the database;
- An activity feed, listing all calls, should be displayed: status of the call, duration, link to an audio file if the caller dropped a voicemail plus other info you have in mind.

### Main steps

Here are some steps to help you start:

- [ ] Create a Twilio account and read carefully the API doc.

- [ ] Buy a Number on Twilio and try to call it.

- [ ] Create an `Application` and Twilio tools you will use for calls.

- [ ] Create the `Call` model in order to store data about calls.

- [ ] Forward incoming calls according to the previous strategies.