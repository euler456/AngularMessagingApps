const request = require('supertest');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const path = require('path');
const assert = require('chai').assert;
const sinon = require('sinon');
const PORT = 3000;
const dbName = 'ChatDatabase';

const { MongoClient } = require('mongodb'),
  client = new MongoClient('mongodb://127.0.0.1:27017/');

const db = client.db(dbName);

const routeHandler = require('../router/chat')(db, app, client);

describe(' /chat', function() {
  it('should return group data with valid group ID', async function() {
    const req = {
      body: {
        groupId: 1, // Replace with a valid group ID for testing
      },
    };

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    // Mock the findOne and find methods of collections
    const mockFindOne = sinon.stub().resolves({
      groupid: 123,
      group: 'Test Group',
      channels: ['Channel1', 'Channel2'],
    });
    const mockFind = sinon.stub().resolves([
      { username: 'User1', groupid: 123 },
      { username: 'User2', groupid: 123 },
    ]);

    const mockGroupsCollection = {
      findOne: mockFindOne,
    };

    const mockUsersCollection = {
      find: mockFind,
    };

    sinon.stub(db, 'collection');
    db.collection.withArgs('groups').returns(mockGroupsCollection);
    db.collection.withArgs('users').returns(mockUsersCollection);

    await routeHandler(req, res);

    sinon.assert.calledOnce(client.connect);
    sinon.assert.calledWith(db.collection, 'groups');
    sinon.assert.calledWith(db.collection, 'users');
    sinon.assert.calledWith(mockFindOne, { groupid: 123 });

    assert.deepEqual(res.json.firstCall.args[0], {
      group: 'Test Group',
      channels: ['Channel1', 'Channel2'],
      users: ['User1', 'User2'],
    });

    db.collection.restore(); // Restore the original method
  });

  it('should return 404 with invalid group ID', async function() {
    const req = {
      body: {
        groupId: 999, 
      },
    };

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    // Mock the findOne method to return null (no group found)
    const mockFindOne = sinon.stub().resolves(null);

    const mockGroupsCollection = {
      findOne: mockFindOne,
    };

    db.collection.withArgs('groups').returns(mockGroupsCollection);

    await routeHandler(req, res);

    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, { error: 'Group not found' });
  });

  it('should handle errors', async function() {
    const req = {
      body: {
        groupId: 123, // Replace with a valid group ID for testing
      },
    };

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    // Mock the findOne method to throw an error
    const mockFindOne = sinon.stub().throws(new Error('Database error'));

    const mockGroupsCollection = {
      findOne: mockFindOne,
    };

    db.collection.withArgs('groups').returns(mockGroupsCollection);

    await routeHandler(req, res);

    sinon.assert.calledWith(res.status, 500);
    sinon.assert.calledWith(res.json, { error: 'An error occurred' });
  });
});
