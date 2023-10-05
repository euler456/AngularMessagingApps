const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;

// Mocking the database and client
const mockDb = {
  collection: sinon.stub(),
};

const mockClient = {
  connect: sinon.stub().resolves(),
  close: sinon.stub().resolves(),
};

// Importing the route handler
const routeHandler = require('../router/groupadmin.js')(mockDb, app, mockClient);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

describe('POST /groupadmin', function() {
  it('should return success on creating a new group', async function() {
    const req = {
      body: {
        action: 'createGroup',
        group: 'Test Group',
      },
    };

    const res = {
      send: sinon.spy(),
    };

    // Mock the insertOne method of collections
    const mockInsertOne = sinon.stub().resolves({
      insertedId: 'someId',
    });

    const mockGroupsCollection = {
      insertOne: mockInsertOne,
    };

    mockDb.collection.withArgs('groups').returns(mockGroupsCollection);

    await routeHandler(req, res);

    sinon.assert.calledWith(mockDb.collection, 'groups');
    sinon.assert.calledWith(mockInsertOne, {
      group: 'Test Group',
      channels: [],
      groupid: 1, // Assuming this is the next group ID
    });

    sinon.assert.calledWith(res.send, { success: true });
  });

  it('should return error when creating a group fails', async function() {
    const req = {
      body: {
        action: 'createGroup',
        group: 'Test Group',
      },
    };

    const res = {
      send: sinon.spy(),
    };

    // Mocking the insertOne method to simulate failure
    const mockInsertOne = sinon.stub().resolves({
      insertedId: null,
    });

    const mockGroupsCollection = {
      insertOne: mockInsertOne,
    };

    mockDb.collection.withArgs('groups').returns(mockGroupsCollection);

    await routeHandler(req, res);

    sinon.assert.calledWith(mockDb.collection, 'groups');
    sinon.assert.calledWith(mockInsertOne, {
      group: 'Test Group',
      channels: [],
      groupid: 1, // Assuming this is the next group ID
    });

    sinon.assert.calledWith(res.send, { success: false, message: 'Failed to create a new group.' });
  });

  // Add more test cases for other actions (listGroups, deleteGroup, etc.)
});
