//SPDX-License-Identifier:UNLICENSE
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "./libraries/Base64.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyEpicGame is ERC721 {
    event attackEvent(uint256 tokenId, uint256 newPenHp, uint256 newBossHp);
    event mintEvent(address minter, uint256 tokenId, Pen pen);

    struct Boss {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }
    Boss public boss;

    struct Pen {
        uint256 index;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }
    Pen[] public pens;

    using Counters for Counters.Counter;
    // Counters.Counter private _tokenIds;
    Counters.Counter public _tokenIds;

    mapping(uint256 => Pen) public penOfTokenId;
    mapping(uint256 => address) public tokenIdToOwner;
    mapping(address => uint256) public tokenCountOfOwner;

    constructor(
        string[] memory names,
        string[] memory URIs,
        uint256[] memory hps,
        uint256[] memory attackDamages,
        string memory bossName,
        string memory bossURI,
        uint256 bossHp,
        uint256 bossAttackDamage
    ) ERC721("Heroes", "HERO") {
        boss = Boss({
            name: bossName,
            imageURI: bossURI,
            hp: bossHp,
            maxHp: bossHp,
            attackDamage: bossAttackDamage
        });
        console.log(
            "Boss was  created!!! Name: %s, imageURI: %s, Hp: %s",
            bossName,
            bossURI,
            bossHp
        );
        for (uint256 i = 0; i < names.length; i++) {
            Pen memory pen = Pen({
                index: i,
                name: names[i],
                imageURI: URIs[i],
                hp: hps[i],
                maxHp: hps[i],
                attackDamage: attackDamages[i]
            });
            console.log(
                "Pen was created!! name: %s, imageURI: %s, HP: %s",
                pen.name,
                pen.imageURI,
                pen.hp
            );
            pens.push(pen);
        }
        _tokenIds.increment();
    }

    function mint(uint8 _whichPenToChoose) public {
        uint256 tokenId = _tokenIds.current();
        _safeMint(msg.sender, tokenId);
        tokenIdToOwner[tokenId] = msg.sender;

        Pen memory pen = pens[_whichPenToChoose];
        penOfTokenId[tokenId] = pen;
        tokenCountOfOwner[msg.sender]++;

        emit mintEvent(msg.sender, tokenId, pen);

        console.log(
            "Mint NFT tokenId : %s and is Pen %s",
            tokenId,
            _whichPenToChoose
        );
        _tokenIds.increment();
    }

    function getTemplate() public view returns (Pen[] memory) {
        return pens;
    }

    function attack(uint256 tokenId) public {
        require(
            tokenIdToOwner[tokenId] == msg.sender,
            "You are not the owner of this token!!!!"
        );
        Pen storage pen = penOfTokenId[tokenId];
        require(pen.hp > 0, "You are already died!!!");
        require(boss.hp > 0, "Boss is already died!!!");
        console.log("begin fighting.....");
        if (boss.hp <= pen.attackDamage) {
            boss.hp = 0;
            console.log("you kill Boss!!!!!!!");
        } else {
            boss.hp -= pen.attackDamage;
            console.log("You attack Boss!!!! boss has Hp: %s left.", boss.hp);
        }
        if (pen.hp <= boss.attackDamage) {
            //attack by boss
            pen.hp = 0;
            console.log("You are killed by Boss!!");
        } else {
            pen.hp -= boss.attackDamage;
            console.log("You are attacked by Boss and Hp: %s  left", pen.hp);
        }
        emit attackEvent(tokenId, pen.hp, boss.hp);
    }

    function setTokenURI(uint256 tokenId, string memory _URI) public {
        Pen storage pen = penOfTokenId[tokenId];
        pen.imageURI = _URI;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        Pen memory pen = penOfTokenId[_tokenId];

        string memory strHp = Strings.toString(pen.hp);
        string memory strMaxHp = Strings.toString(pen.maxHp);
        string memory strAttackDamage = Strings.toString(pen.attackDamage);

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                pen.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                pen.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',
                strHp,
                ', "max_value":',
                strMaxHp,
                '}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,
                "} ]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    // function getTokenIds(address owner) public view returns (uint256[] memory) {
    //     uint256[] memory tokenIds = new uint256[](tokenCountOfOwner[owner]);
    //     uint256 count;
    //     for (uint256 i = 0; i < _tokenIds.current(); i++) {
    //         if (tokenIdToOwner[i] == msg.sender) {
    //             tokenIds[count] = i;
    //             count++;
    //         }
    //     }
    //     return tokenIds;
    // }
    function getTokenIds(address owner) public view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](tokenCountOfOwner[owner]);
        uint256 count = 0;
        for (uint256 i = 0; i < _tokenIds.current(); i += 1) {
            if (tokenIdToOwner[i] == msg.sender) {
                tokenIds[count] = i;
                count += 1;
            }
        }
        return tokenIds;
    }
}
