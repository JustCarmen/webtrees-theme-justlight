<?php use Fisharebest\Webtrees\Html; ?>
<?php use Fisharebest\Webtrees\I18N; ?>

<h2 class="wt-page-title">
	<?= I18N::translate("Report") . ' - ' . $title ?><br/>
  <small class="text-muted"><?= $description ?></small>
</h2>
<hr/>

<form action="reportengine.php" class="jc-view-report-setup">
	<input type="hidden" name="action" value="run">
	<input type="hidden" name="report" value="<?= Html::escape($report) ?>">

	<?php foreach ($inputs as $n => $input): ?>
		<input type="hidden" name="varnames[]" value="<?= Html::escape($input['name']) ?>">
		<div class="row form-group">
			<label class="col-sm-3 col-form-label text-right" for="input-<?= $n ?>">
				<?= I18N::translate($input['value']) ?>
			</label>
      <?php if ($input['extra']): ?>
			<div class="col-sm-9 input-group input-group-sm">
				<?= $input['control'] ?>
        <div class="input-group-addon"><?= $input['extra'] ?></div>
			</div>
      <?php else: ?>
      <div class="col-sm-9">
				<?= $input['control'] ?>
			</div>
      <?php endif; ?>
		</div>
	<?php endforeach ?>

	<div class="row form-group">
		<div class="col-sm-3 col-form-label text-right">
		</div>

		<div class="col-sm-9 d-flex justify-content-around">
			<div class="text-center">
				<label for="HTML"><i class="icon-mime-text-html"></i></label>
				<br>
				<input type="radio" name="output" id="HTML" value="HTML" checked>
			</div>
			<div class="text-center">
				<label for="PDF"><i class="icon-mime-application-pdf"></i></label>
				<br>
				<input type="radio" name="output" value="PDF" id="PDF">
			</div>
		</div>
	</div>

	<div class="row form-group">
		<div class="col-sm-3 col-form-label text-right"></div>
		<div class="col-sm-9">
			<button type="submit" class="btn btn-primary">
				<?= I18N::translate('continue') ?>
			</button>
		</div>
	</div>
</form>
