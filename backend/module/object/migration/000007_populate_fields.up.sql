INSERT INTO fields (id, object_id, organization_id, created_by_id, created_at, label, data_type, default_value, is_indexed, is_required)
VALUES
    ('f1e56d30-5c34-497e-9b7f-401aedf3d8a6', '1b3505c9-847a-4772-b920-8212dc21731f', 1, 0, NOW(), 'gender', 'picklist', NULL, TRUE, TRUE),
    ('8ad26a42-3743-45d7-989f-726235d3a1e1', '1b3505c9-847a-4772-b920-8212dc21731f', 1, 0, NOW(), 'subscription', 'picklist', 'Basic', TRUE, TRUE),
    ('b2d7b0ae-2130-4a1f-ae15-527f5ebd379f', '1b3505c9-847a-4772-b920-8212dc21731f', 1, 0, NOW(), 'age', 'number', NULL, TRUE, FALSE),
    ('3e496233-2cf8-4b8c-bc7d-b29e92f1a029', '1b3505c9-847a-4772-b920-8212dc21731f', 1, 0, NOW(), 'description', 'string', NULL, FALSE, FALSE),
    ('baf4649b-56d7-4aa7-b1a3-163dd449ab3c', '1b3505c9-847a-4772-b920-8212dc21731f', 1, 0, NOW(), 'dob', 'date', NULL, TRUE, FALSE),
    ('ff9070b8-6e60-464d-83f6-d10d1ac445c3', '8b2a325d-b02c-4181-b8cc-0c39b2fa4fd7', 1, 0, NOW(), 'width', 'number', NULL, FALSE, FALSE),
    ('dcad344a-f1c0-4e5d-b471-3f7e6e3a9e0a', '8b2a325d-b02c-4181-b8cc-0c39b2fa4fd7', 1, 0, NOW(), 'length', 'number', NULL, FALSE, FALSE),
    ('35a1c248-3f37-4872-a6b8-2efb01e4c2f4', '8b2a325d-b02c-4181-b8cc-0c39b2fa4fd7', 1, 0, NOW(), 'height', 'number', NULL, FALSE, FALSE),
    ('f2877d38-6b7c-44d5-828f-769bdb5d02db', '8b2a325d-b02c-4181-b8cc-0c39b2fa4fd7', 1, 0, NOW(), 'category', 'picklist', NULL, FALSE, FALSE);

INSERT INTO picklist_values (id, field_id, value)
VALUES
    ('86879170-fffe-481d-8fc3-a136b4b4d77b', 'f1e56d30-5c34-497e-9b7f-401aedf3d8a6', 'Male'),
    ('4ef3bb45-eb1d-40ca-8bd4-1a0d63e8fd5f', 'f1e56d30-5c34-497e-9b7f-401aedf3d8a6', 'Female'),
    ('9f62ae35-eefd-4615-8fd4-c57e6429c88a', '8ad26a42-3743-45d7-989f-726235d3a1e1', 'Basic'),
    ('ddf84913-5f9b-4164-adc1-f0f48744a640', '8ad26a42-3743-45d7-989f-726235d3a1e1', 'Standard'),
    ('2e116c21-8356-42ff-aba3-64c9f4e71ac5', '8ad26a42-3743-45d7-989f-726235d3a1e1', 'Premium'),
    ('5016f74c-5f2a-459e-89c8-20d4273e458b', 'f2877d38-6b7c-44d5-828f-769bdb5d02db', 'Electronic'),
    ('fcaee8cd-2a6a-4ab2-abc2-a37f5970de39', 'f2877d38-6b7c-44d5-828f-769bdb5d02db', 'Non Electronic');
