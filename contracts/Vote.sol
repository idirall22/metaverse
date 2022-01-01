// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

contract VoteSystem {
    event CreateVote(string position0, string position1);
    event UserVote(address user);

    struct Vote {
        string position0;
        string position1;
        string description;
        uint256 counterPosition0;
        uint256 counterPosition1;
        uint256 time;
    }
    
    uint256 public counter;
    mapping(uint256 => Vote) public votes;

    mapping(uint256 => mapping(address => bool)) public usersVote;

    function createVote(
        string calldata _position0,
        string calldata _position1,
        string calldata _description,
        uint256 _time
    ) external {
        counter++;

        votes[counter] = Vote({
            position0: _position0,
            position1: _position1,
            description: _description,
            counterPosition0: 0,
            counterPosition1: 0,
            time: _time
        });

        emit CreateVote(_position0, _position1);
    }

    function vote(uint256 _voteId, uint256 _position) external {
        require(!usersVote[_voteId][msg.sender], "The user already voted");
        require(_voteId <= counter, "vote id is not valid");
        require(_position <= 1, "position is not valid");

        if (_position == 0) {
            votes[_voteId].counterPosition0++;
        } else {
            votes[_voteId].counterPosition1++;
        }
        usersVote[_voteId][msg.sender] = true;

        emit UserVote(msg.sender);
    }
}
