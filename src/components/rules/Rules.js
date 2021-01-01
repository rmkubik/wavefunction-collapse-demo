import React from "react";
import { remove } from "ramda";

import { getOppositeDirection } from "../../services/utils";
import { removeDuplicateRules } from "../../services/rules";
import Row from "../Row";
import Column from "../Column";
import AddRuleForm from "./AddRuleForm";
import RulesList from "./RulesList";
import GridPainter from "./GridPainter";

const Rules = ({ rules, setRules, tileTypes }) => {
  const addRule = (newRuleOptions) => {
    const newRules = newRuleOptions.addSymmetricRule
      ? [
          [
            newRuleOptions.origin,
            newRuleOptions.target,
            newRuleOptions.direction,
          ],
          [
            newRuleOptions.target,
            newRuleOptions.origin,
            getOppositeDirection(newRuleOptions.direction),
          ],
        ]
      : [
          [
            newRuleOptions.origin,
            newRuleOptions.target,
            newRuleOptions.direction,
          ],
        ];

    setRules(removeDuplicateRules([...rules, ...newRules]));
  };

  const removeRule = (ruleIndex) => {
    setRules(remove(ruleIndex, 1, rules));
  };

  return (
    <>
      <h2>Rules</h2>
      <Row>
        <Column>
          <RulesList rules={rules} removeRule={removeRule} />
          <AddRuleForm addRule={addRule} tileTypes={tileTypes} />
        </Column>
        <Column>
          <h3>Generate Rules from Image</h3>
          <GridPainter tileTypes={tileTypes} />
        </Column>
      </Row>
    </>
  );
};

export default Rules;
