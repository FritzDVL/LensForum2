-- SEED DATA FOR CATEGORIES AND TAGS
-- Replace '0xa9dD68cA2Bd21140354a95E8ce4CbDa80BC4f775' with your actual Channel Address if different.

DO $$
DECLARE
    target_channel_address TEXT := '0xa9dD68cA2Bd21140354a95E8ce4CbDa80BC4f775';
BEGIN

    -- 1. Game Theory Section
    INSERT INTO categories (channel_address, name, slug, color, description) VALUES
    (target_channel_address, 'Economic Game Theory', 'economic-game-theory', '#FF6B6B', 'Discussions on incentives, payoffs, and strategic interactions.'),
    (target_channel_address, 'Levels', 'levels', '#4ECDC4', 'Discussion about the various levels of the Society Protocol.'),
    (target_channel_address, 'Levels Ideas', 'levels-ideas', '#45B7D1', 'Brainstorming new levels and mechanics.');

    -- 2. Technical Section
    INSERT INTO categories (channel_address, name, slug, color, description) VALUES
    (target_channel_address, 'General Architecture', 'general-architecture', '#96CEB4', 'High-level technical architecture discussions.'),
    (target_channel_address, 'State Machine', 'state-machine', '#FFEEAD', 'State storage and state transition function logic.'),
    (target_channel_address, 'Architectural Objects', 'architectural-objects', '#D4A5A5', 'Defining the core objects and levels within the system.'),
    (target_channel_address, 'Account System', 'account-system', '#9B59B6', 'Identity, wallets, and user management.'),
    (target_channel_address, 'Consensus', 'consensus', '#3498DB', 'Proof of Hunt and consensus mechanisms.'),
    (target_channel_address, 'Security', 'security', '#E74C3C', 'Audits, vulnerabilities, and security practices.'),
    (target_channel_address, 'Cryptography', 'cryptography', '#34495E', 'Zero-knowledge proofs, signatures, and encryption.');

    -- 3. Other Section
    INSERT INTO categories (channel_address, name, slug, color, description) VALUES
    (target_channel_address, 'Meta', 'meta', '#95A5A6', 'Discussion about the Society Protocol Forum itself.'),
    (target_channel_address, 'Politics & Society', 'politics-society', '#F1C40F', 'Impacts on society, optimization, and world events.'),
    (target_channel_address, 'Economics', 'economics', '#2ECC71', 'Broader economic theory and markets.'),
    (target_channel_address, 'Cryptocurrencies & Web3', 'crypto-web3', '#1ABC9C', 'General crypto and Web3 ecosystem discussion.'),
    (target_channel_address, 'Off-topic', 'off-topic', '#7F8C8D', 'Anything not related to the protocol.');

    -- 4. Local Section
    INSERT INTO categories (channel_address, name, slug, color, description) VALUES
    (target_channel_address, 'Local', 'local', '#E67E22', 'Regional discussions and languages.');


    -- TAGS (Derived from "Levels" sub-items and general topics)
    INSERT INTO tags (channel_address, name, slug) VALUES
    -- Levels Tags
    (target_channel_address, 'Parenting', 'parenting'),
    (target_channel_address, 'Hunting', 'hunting'),
    (target_channel_address, 'Property', 'property'),
    (target_channel_address, 'Curation', 'curation'),
    (target_channel_address, 'Governance', 'governance'),
    (target_channel_address, 'Organizations', 'organizations'),
    (target_channel_address, 'Communication', 'communication'),
    (target_channel_address, 'Farming', 'farming'),
    (target_channel_address, 'Portal', 'portal'),
    
    -- Local/Language Tags
    (target_channel_address, 'English', 'english'),
    (target_channel_address, 'Spanish', 'spanish'),
    (target_channel_address, 'Chinese', 'chinese'),
    (target_channel_address, 'French', 'french');

END $$;
